import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import Stripe from 'stripe';
import { User } from '../users/entities/user.entity';
import { Payment } from './entities/payment.entity';

const creditsMapper = {
  starter: 30,
  professional: 125,
  enterprise: 1000,
};

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private dataSource: DataSource,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'));
  }

  async createCheckoutSession(
    userId: string,
    plan: 'starter' | 'professional' | 'enterprise',
  ): Promise<string> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });

      let customerId = user.stripeCustomerId;

      if (!customerId) {
        const customer = await this.stripe.customers.create({
          email: user.email,
          metadata: {
            userId: user.id,
          },
        });
        customerId = customer.id;
        await this.usersRepository.update(user.id, {
          stripeCustomerId: customerId,
        });
      }

      const priceId = this.configService.get(
        `STRIPE_${plan.toUpperCase()}_PRICE_ID`,
      );
      if (!priceId) {
        throw new Error(`Price ID not found for plan: ${plan}`);
      }

      const session = await this.stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${this.configService.get('FRONTEND_URL')}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.configService.get('FRONTEND_URL')}`,
        metadata: {
          userId: user.id,
          plan: plan,
        },
      });

      return session.url;
    } catch (error) {
      this.logger.error(`Error creating checkout session: ${error.message}`);
      throw error;
    }
  }

  async createPortalSession(userId: string): Promise<string> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });

      if (!user.stripeCustomerId) {
        throw new Error('No Stripe customer ID found for user');
      }

      const session = await this.stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${this.configService.get('FRONTEND_URL')}/dashboard`,
      });

      return session.url;
    } catch (error) {
      this.logger.error(`Error creating portal session: ${error.message}`);
      throw error;
    }
  }

  private async getSessionDetails(session: Stripe.Checkout.Session): Promise<{
    chargeId: string;
    plan: keyof typeof creditsMapper;
    userId: string;
  }> {
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan as keyof typeof creditsMapper;

    if (!userId) {
      throw new Error('No user ID found in session metadata');
    }

    if (!plan || !(plan in creditsMapper)) {
      throw new Error('Invalid or missing plan in session metadata');
    }

    const sessionDetails = await this.stripe.checkout.sessions.retrieve(
      session.id,
      {
        expand: ['payment_intent'],
      },
    );

    // @ts-expect-error: latest_charge is always present
    const chargeId = sessionDetails.payment_intent.latest_charge;

    return { chargeId, plan, userId };
  }

  private async grantCreditsToUser({
    userId,
    plan,
    paymentIntentId,
    chargeId,
  }: {
    userId: string;
    plan: keyof typeof creditsMapper;
    paymentIntentId: string;
    chargeId: string;
  }): Promise<void> {
    const credits = creditsMapper[plan];

    try {
      await this.dataSource.transaction(async (manager) => {
        // Find or create payment record
        const payment = await manager.findOne(Payment, {
          where: { paymentIntentId },
        });

        if (payment) {
          // Update existing payment
          await manager.update(Payment, { id: payment.id }, { status: 'paid' });
        } else {
          // Create new payment record
          await manager.save(Payment, {
            userId,
            paymentIntentId,
            credits,
            status: 'paid',
            chargeId,
          });
        }

        // Add credits to user
        await manager.increment(User, { id: userId }, 'credits', credits);
      });

      this.logger.log(
        `Granted ${credits} credits for user ${userId} with plan ${plan}`,
      );
    } catch (error) {
      this.logger.error(`Error granting credits: ${error.message}`);
      throw error;
    }
  }

  private async validateCheckoutSession(
    session: Stripe.Checkout.Session,
  ): Promise<boolean> {
    // Check if payment is successful
    if (session.payment_status !== 'paid') {
      this.logger.warn(
        `Checkout session ${session.id} has payment status ${session.payment_status}, skipping fulfillment`,
      );

      return false;
    }

    // Check if we have already fulfilled this session
    const existingPayment = await this.paymentsRepository.findOne({
      where: { paymentIntentId: session.payment_intent as string },
    });

    if (existingPayment?.status === 'paid') {
      this.logger.log(
        `Checkout session ${session.id} has already been fulfilled`,
      );

      return false;
    }

    return true;
  }

  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ): Promise<void> {
    try {
      // Validate the session
      if (!(await this.validateCheckoutSession(session))) {
        return;
      }

      // Extract and validate metadata
      const { userId, plan, chargeId } = await this.getSessionDetails(session);

      // Process business logic - grant credits
      await this.grantCreditsToUser({
        userId,
        plan,
        paymentIntentId: session.payment_intent as string,
        chargeId,
      });

      this.logger.log(
        `Successfully fulfilled checkout session ${session.id} for user ${userId}`,
      );
    } catch (error) {
      this.logger.error(
        `Error processing checkout session ${session.id}: ${error.message}`,
      );
      throw error;
    }
  }

  private async revokeCreditsFromUser(
    userId: string,
    paymentIntentId: string,
  ): Promise<void> {
    try {
      const payment = await this.paymentsRepository.findOne({
        where: { paymentIntentId },
      });

      if (!payment) {
        throw new Error('No payment found for this payment intent');
      }

      await this.dataSource.transaction(async (manager) => {
        await manager.decrement(
          User,
          { id: userId },
          'credits',
          payment.credits,
        );
        await manager.update(
          Payment,
          { id: payment.id },
          { status: 'refunded' },
        );
      });

      this.logger.log(
        `Revoked ${payment.credits} credits from user ${userId} due to fraud warning`,
      );
    } catch (error) {
      this.logger.error(`Error revoking credits: ${error.message}`);
      throw error;
    }
  }

  private async refundCustomerByChargeId(chargeId: string): Promise<void> {
    await this.stripe.refunds.create({ charge: chargeId });
  }

  private async handleEarlyFraudWarning(
    warning: Stripe.Radar.EarlyFraudWarning,
  ): Promise<void> {
    const chargeId = warning.charge as string;

    // Find payment by chargeId
    const payment = await this.paymentsRepository.findOne({
      where: { chargeId },
    });

    await this.refundCustomerByChargeId(chargeId);

    if (payment) {
      // If we find a payment, it means credits were granted, so we need to revoke them
      await this.revokeCreditsFromUser(payment.userId, payment.paymentIntentId);
      this.logger.warn(
        `Fraud warning for charge ${chargeId}. User ${payment.userId} flagged for review.`,
      );
    } else {
      this.logger.log(
        `Early fraud warning for charge ${chargeId} before credits were granted. No action needed.`,
      );
    }
  }

  private async closeDispute(dispute: Stripe.Dispute): Promise<void> {
    const updatedDispute = await this.stripe.disputes.close(dispute.id);

    this.logger.log(
      `Dispute ${dispute.id} closed. Reason: ${updatedDispute.reason}`,
    );
  }

  private async handleChargeDispute(dispute: Stripe.Dispute): Promise<void> {
    await this.closeDispute(dispute);

    const chargeId = dispute.charge as string;

    // Find payment by chargeId
    const payment = await this.paymentsRepository.findOne({
      where: { chargeId },
    });

    if (payment) {
      // If we find a payment, it means credits were granted, so we need to revoke them
      await this.revokeCreditsFromUser(payment.userId, payment.paymentIntentId);
      this.logger.warn(
        `Fraud warning for charge ${chargeId}. User ${payment.userId} flagged for review.`,
      );
    } else {
      this.logger.log(
        `Early fraud warning for charge ${chargeId} before credits were granted. No action needed.`,
      );
    }
  }

  async handleWebhookEvent(
    body: any,
    signature: string | string[],
  ): Promise<void> {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');

    if (!webhookSecret) {
      throw new Error('Stripe webhook secret is not configured');
    }

    const event = this.stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret,
    );
    this.logger.log(`Event type: ${event.type}`);

    try {
      switch (event.type) {
        case 'checkout.session.completed':
        case 'checkout.session.async_payment_succeeded': {
          await this.handleCheckoutSessionCompleted(
            event.data.object as Stripe.Checkout.Session,
          );
          break;
        }

        case 'checkout.session.async_payment_failed': {
          this.logger.warn(
            `Async payment failed for session ${event.data.object.id}`,
          );
          break;
        }

        case 'radar.early_fraud_warning.created': {
          await this.handleEarlyFraudWarning(
            event.data.object as Stripe.Radar.EarlyFraudWarning,
          );
          break;
        }

        case 'charge.dispute.created': {
          await this.handleChargeDispute(event.data.object as Stripe.Dispute);
          break;
        }

        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      this.logger.error(`Error handling webhook event: ${error.message}`);
      this.logger.error('Error details:', error);
      throw error;
    }
  }
}
