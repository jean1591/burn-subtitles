import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import Stripe from 'stripe';
import { User } from '../users/entities/user.entity';
import { Payment } from './entities/payment.entity';

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
        /* case 'charge.dispute.created': {
          const disputeSession = event.data.object;
          const chargeId = disputeSession.charge as string;

          // TODO: notify me using telegram bot

          this.logger.log(`Stripe - charge.dispute.created - ${chargeId}`);
          break;
        }

        case 'charge.dispute.funds_withdrawn': {
          const disputeSession = event.data.object;
          const chargeId = disputeSession.charge as string;

          const charge = await this.stripe.charges.retrieve(chargeId);

          if (charge.metadata.credits_granted !== 'true') {
            this.logger.log(
              'Stripe - charge.dispute.funds_withdrawn - Checkout session not completed yet, no refund or revoke needed',
            );
            return;
          }

          try {
            const charge = await this.stripe.charges.retrieve(chargeId);
            const paymentIntentId = charge.payment_intent as string;

            if (!paymentIntentId) {
              throw new Error('No payment intent found for charge');
            }

            await this.refundCustomerByPaymentIntentId(paymentIntentId, event);
          } catch (error) {
            this.logger.error(
              `Error handling fraud warning for charge ${chargeId}: ${error.message}`,
            );
          }
          break;
        }

        case 'charge.refunded': {
          const refundSession = event.data.object;
          const paymentIntentId = refundSession.payment_intent as string;

          if (!paymentIntentId) {
            throw new Error(
              'Stripe - charge.refunded - No paymentIntentId linked',
            );
          }

          await this.refundCustomerByPaymentIntentId(paymentIntentId, event);
          break;
        }

        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          const userId = paymentIntent.metadata?.userId;
          const plan = paymentIntent.metadata?.plan;

          if (!userId) {
            throw new Error('No user ID found in payment intent metadata');
          }

          if (!plan) {
            throw new Error('No plan found in payment intent metadata');
          }

          // Determine credits based on plan
          const credits = {
            starter: 30,
            professional: 125,
            enterprise: 1000,
          }[plan];

          try {
            // Only create the payment record, don't add credits yet
            await this.paymentsRepository.save({
              userId,
              paymentIntentId: paymentIntent.id,
              credits,
              status: 'pending', // Set as pending until checkout is completed
            });

            this.logger.log(
              `Stripe - payment_intent.succeeded - Created payment record for user ${userId} with plan ${plan}`,
            );
          } catch (error) {
            this.logger.error(
              `Error creating payment record: ${error.message}`,
            );
            throw error;
          }
          break;
        } */

        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;

          const rawPI = await this.stripe.paymentIntents.retrieve(
            session.payment_intent as string,
            {
              expand: ['charges'],
            },
          );

          const paymentIntent = rawPI as unknown as Stripe.PaymentIntent & {
            charges: Stripe.ApiList<Stripe.Charge>;
          };

          const charge = paymentIntent.charges.data[0];
          if (charge.disputed) {
            this.logger.log(
              `Stripe - checkout.session.completed - Charge ${charge.id} has already been disputed — skipping credit assignment.`,
            );
            return;
          }

          const userId = session.metadata?.userId;
          const plan = session.metadata?.plan;
          this.logger.log('User ID:', userId);
          this.logger.log('Plan:', plan);

          if (!userId) {
            throw new Error('No user ID found in session metadata');
          }

          if (!plan) {
            throw new Error('No plan found in session metadata');
          }

          // Determine credits based on plan
          const credits = {
            starter: 30,
            professional: 125,
            enterprise: 1000,
          }[plan];

          try {
            await this.dataSource.transaction(async (manager) => {
              // Find the payment record
              const payment = await manager.findOne(Payment, {
                where: {
                  paymentIntentId: session.payment_intent as string,
                  status: 'pending',
                },
              });

              if (!payment) {
                throw new Error('No pending payment found for this session');
              }

              // Update payment status and add credits
              await manager.update(
                Payment,
                { id: payment.id },
                { status: 'paid' },
              );

              await manager.increment(User, { id: userId }, 'credits', credits);
            });

            await this.stripe.charges.update(charge.id, {
              metadata: {
                credits_granted: 'true',
              },
            });

            this.logger.log(
              `Stripe - checkout.session.completed - Added ${credits} credits for user ${userId} with plan ${plan}`,
            );
          } catch (error) {
            this.logger.error(
              `Error processing checkout session: ${error.message}`,
            );
            throw error;
          }
          break;
        }

        case 'radar.early_fraud_warning.created': {
          const warningSession = event.data.object;
          const chargeId = warningSession.charge as string;

          try {
            const charge = await this.stripe.charges.retrieve(chargeId);
            const paymentIntentId = charge.payment_intent as string;

            if (!paymentIntentId) {
              throw new Error('No payment intent found for charge');
            }

            await this.refundCustomerByPaymentIntentId(paymentIntentId, event);
          } catch (error) {
            this.logger.error(
              `Error handling fraud warning for charge ${chargeId}: ${error.message}`,
            );
          }
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

  private async refundCustomerByPaymentIntentId(
    paymentIntentId: string,
    event: Stripe.Event,
  ): Promise<void> {
    const payment = await this.paymentsRepository.findOne({
      where: { paymentIntentId },
    });
    console.log('🚀 ~ payment:', payment);

    if (!payment) {
      throw new Error('No payments found in database');
    }

    // Check if payment is already refunded
    if (payment.status === 'refunded') {
      this.logger.log(
        `Stripe - ${event.type} - Payment already refunded - ${payment.userId} - ${paymentIntentId}`,
      );
      return;
    }

    // Get the charge ID from the payment intent
    const paymentIntent =
      await this.stripe.paymentIntents.retrieve(paymentIntentId);
    console.log('🚀 ~ paymentIntent:', paymentIntent);
    const chargeId = paymentIntent.latest_charge as string;
    console.log('🚀 ~ chargeId:', chargeId);

    if (!chargeId) {
      throw new Error('No charges found for payment intent');
    }

    await this.stripe.refunds.create({
      charge: chargeId,
      reason: 'fraudulent',
    });

    try {
      await this.dataSource.transaction(async (manager) => {
        await manager.decrement(
          User,
          { id: payment.userId },
          'credits',
          payment.credits,
        );
        await manager.update(
          Payment,
          { id: payment.id },
          { status: 'refunded' },
        );
      });
    } catch (error) {
      this.logger.error(
        `Stripe - ${event.type} - Error updating user credits - ${payment.userId} - ${paymentIntentId}`,
      );

      throw error;
    }

    this.logger.log(
      `Stripe - ${event.type} - Refunded payment ${paymentIntentId} for user ${payment.userId}`,
    );
  }
}
