import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { PaymentWebhookDto, AIJobWebhookDto } from './dto/webhook.dto';

@Controller('api/v1/webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('payment')
  @HttpCode(HttpStatus.OK)
  handlePayment(@Body() dto: PaymentWebhookDto) {
    return this.webhooksService.handlePaymentWebhook(dto);
  }

  @Post('ai-job')
  @HttpCode(HttpStatus.OK)
  handleAIJob(@Body() dto: AIJobWebhookDto) {
    return this.webhooksService.handleAIJobWebhook(dto);
  }
}
