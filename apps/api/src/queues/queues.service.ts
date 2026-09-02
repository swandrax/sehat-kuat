import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQueueDto, UpdateQueueDto } from './dto/queue.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { QueueStatus } from '@prisma/client';
import { AppEventsService } from '../common/events/events.service';

@Injectable()
export class QueuesService {
  constructor(
    private prisma: PrismaService,
    private events: AppEventsService,
  ) {}

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
    } else if (user?.role === 'DOCTOR') {
      const doctor = await this.prisma.doctor.findUnique({
        where: { userId: user.sub },
      });
      if (doctor) where.doctorId = doctor.id;
    }

    const [data, total] = await Promise.all([
      this.prisma.queue.findMany({
        where,
        skip,
        take: limit,
        include: {
          patient: { include: { user: { select: { name: true, phone: true } } } },
          doctor: { include: { user: { select: { name: true } }, clinic: true } },
          clinic: true,
        },
        orderBy: [{ date: 'desc' }, { queueNumber: 'asc' }],
      }),
      this.prisma.queue.count({ where }),
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
    const queue = await this.prisma.queue.findUnique({
      where: { id },
      include: {
        patient: { include: { user: { select: { name: true, phone: true } } } },
        doctor: { include: { user: { select: { name: true } } } },
        clinic: true,
        appointment: true,
      },
    });

    if (!queue) {
      throw new NotFoundException('Antrean tidak ditemukan');
    }

    return queue;
  }

  async create(dto: CreateQueueDto) {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Concurrency safe transaction for queue number generation
    const queue = await this.prisma.$transaction(async (tx) => {
      const lastQueue = await tx.queue.findFirst({
        where: {
          doctorId: dto.doctorId,
          date: { gte: startOfDay, lte: endOfDay },
        },
        orderBy: { queueNumber: 'desc' },
      });

      const nextQueueNumber = (lastQueue?.queueNumber || 0) + 1;

      return tx.queue.create({
        data: {
          doctorId: dto.doctorId,
          patientId: dto.patientId,
          clinicId: dto.clinicId,
          appointmentId: dto.appointmentId,
          queueNumber: nextQueueNumber,
          status: QueueStatus.WAITING,
          date: new Date(),
        },
        include: {
          patient: { include: { user: { select: { name: true } } } },
          doctor: { include: { user: { select: { name: true } } } },
        },
      });
    });

    // Broadcast SSE event
    this.events.emit({
      type: 'QUEUE_UPDATED',
      targetId: dto.doctorId,
      payload: { action: 'CREATED', queue },
    });

    return queue;
  }

  async update(id: string, dto: UpdateQueueDto) {
    const queue = await this.findOne(id);

    const data: any = { status: dto.status };
    if (dto.status === QueueStatus.CALLED && !queue.calledAt) {
      data.calledAt = new Date();
    } else if (dto.status === QueueStatus.COMPLETED && !queue.completedAt) {
      data.completedAt = new Date();
    }

    const updated = await this.prisma.queue.update({
      where: { id },
      data,
      include: {
        patient: { include: { user: { select: { name: true } } } },
        doctor: { include: { user: { select: { name: true } } } },
      },
    });

    // Broadcast SSE event for real-time queue ticker
    this.events.emit({
      type: 'QUEUE_UPDATED',
      targetId: updated.doctorId,
      payload: { action: 'UPDATED', queue: updated },
    });

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.queue.delete({
      where: { id },
    });
  }
}
