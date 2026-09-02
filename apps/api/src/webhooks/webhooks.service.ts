import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentWebhookDto, AIJobWebhookDto } from './dto/webhook.dto';
import { PaymentStatus } from '@prisma/client';
import { AppEventsService } from '../common/events/events.service';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private prisma: PrismaService,
    private events: AppEventsService,
  ) {}

  async handlePaymentWebhook(dto: PaymentWebhookDto) {
    this.logger.log(`Processing payment webhook for ref: ${dto.transactionRef}`);

    const payment = await this.prisma.payment.findUnique({
      where: { transactionRef: dto.transactionRef },
      include: {
        patient: { include: { user: true } },
        appointment: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Data pembayaran tidak ditemukan');
    }

    // Idempotency: skip if already processed
    if (payment.status === PaymentStatus.PAID && dto.status === 'PAID') {
      return { success: true, message: 'Pembayaran sudah tercatat sebelumnya (idempotent)' };
    }

    const updatedPayment = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: dto.status as PaymentStatus,
        paidAt: dto.status === 'PAID' ? new Date() : undefined,
        paymentMethod: dto.paymentMethod || payment.paymentMethod,
      },
    });

    // If payment for appointment is completed, confirm the appointment
    if (dto.status === 'PAID' && payment.appointmentId) {
      await this.prisma.appointment.update({
        where: { id: payment.appointmentId },
        data: { status: 'CONFIRMED' },
      });
    }

    // Send Real-time notification via SSE & DB
    await this.prisma.notification.create({
      data: {
        userId: payment.patient.userId,
        type: 'PAYMENT_NOTIFICATION',
        title: dto.status === 'PAID' ? 'Pembayaran Berhasil' : 'Pembayaran Gagal',
        message:
          dto.status === 'PAID'
            ? `Pembayaran Anda sebesar Rp ${payment.amount.toLocaleString()} telah berhasil diverifikasi.`
            : `Pembayaran sebesar Rp ${payment.amount.toLocaleString()} gagal. Silakan coba lagi.`,
      },
    });

    this.events.emit({
      type: 'NOTIFICATION_CREATED',
      targetId: payment.patient.userId,
      payload: {
        type: 'PAYMENT_UPDATE',
        payment: updatedPayment,
      },
    });

    return { success: true, message: 'Webhook pembayaran berhasil diproses', data: updatedPayment };
  }

  async handleAIJobWebhook(dto: AIJobWebhookDto) {
    this.logger.log(`Processing AI job webhook for job: ${dto.jobId}`);
    return { success: true, message: 'AI Job webhook received' };
  }
}
