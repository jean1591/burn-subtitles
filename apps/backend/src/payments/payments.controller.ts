import { Controller, Header, Post, Req, UseGuards, Body } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-checkout-session')
  async createCheckoutSession(
    @Req() req,
    @Body() body: { plan: 'starter' | 'professional' | 'enterprise' },
  ) {
    const userId = req.user?.sub;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const url = await this.paymentsService.createCheckoutSession(
      userId,
      body.plan,
    );

    return { url };
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-portal-session')
  async createPortalSession(@Req() req) {
    const userId = req.user?.sub;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const url = await this.paymentsService.createPortalSession(userId);
    return { url };
  }

  @Post('webhook')
  @Header('Content-Type', 'application/json')
  async handleWebhook(@Req() req: Request) {
    const signature = req.headers['stripe-signature'];
    const rawBody = req.body;

    if (!signature) {
      throw new Error('No Stripe signature found in request headers');
    }

    if (!rawBody) {
      throw new Error('No request body found');
    }

    try {
      await this.paymentsService.handleWebhookEvent(rawBody, signature);
      return { received: true };
    } catch (error) {
      throw new Error(`Webhook Error: ${error.message}`);
    }
  }
}
