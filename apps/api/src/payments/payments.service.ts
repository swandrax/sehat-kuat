import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(pagination: PaginationDto, user?: any) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (user?.role === 'PATIENT') {
      const patient = await this.prisma.patient.findUnique({
        where: { userId: user.sub },
      });
      if (patient) where.patientId = patient.id;
    }

    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        include: {
          patient: { include: { user: { select: { name: true, email: true } } } },
          appointment: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        patient: { include: { user: { select: { name: true, email: true } } } },
        appointment: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Pembayaran tidak ditemukan');
    }

    return payment;
  }

  async create(dto: CreatePaymentDto) {
    const ref = `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return this.prisma.payment.create({
      data: {
        patientId: dto.patientId,
        appointmentId: dto.appointmentId,
        amount: dto.amount,
        currency: dto.currency || 'IDR',
        paymentMethod: dto.paymentMethod || 'QRIS',
        transactionRef: ref,
        status: PaymentStatus.PENDING,
      },
      include: {
        patient: { include: { user: { select: { name: true } } } },
      },
    });
  }

  async update(id: string, dto: UpdatePaymentDto) {
    await this.findOne(id);

    const data: any = { status: dto.status };
    if (dto.transactionRef) data.transactionRef = dto.transactionRef;
    if (dto.status === PaymentStatus.PAID) data.paidAt = new Date();

    return this.prisma.payment.update({
      where: { id },
      data,
      include: {
        patient: { include: { user: { select: { name: true } } } },
      },
    });
  }
}
