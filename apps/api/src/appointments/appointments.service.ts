import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(pagination: PaginationDto, user?: any) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Filter by role if patient or doctor
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
      this.prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        include: {
          patient: { include: { user: { select: { name: true, phone: true, email: true } } } },
          doctor: { include: { user: { select: { name: true } }, clinic: true } },
          clinic: true,
          queue: true,
        },
        orderBy: { appointmentDate: 'desc' },
      }),
      this.prisma.appointment.count({ where }),
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

  async findOne(id: string, user?: any) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: { include: { user: { select: { name: true, phone: true, email: true } } } },
        doctor: { include: { user: { select: { name: true } }, clinic: true } },
        clinic: true,
        queue: true,
        medicalRecord: true,
        payment: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Janji temu tidak ditemukan');
    }

    if (user?.role === 'PATIENT' && appointment.patient.userId !== user.sub) {
      throw new ForbiddenException('Akses ditolak ke janji temu ini');
    }

    if (user?.role === 'DOCTOR' && appointment.doctor.userId !== user.sub) {
      throw new ForbiddenException('Akses ditolak ke janji temu ini');
    }

    return appointment;
  }

  async create(dto: CreateAppointmentDto, user?: any) {
    // If patient is creating, auto-bind patient ID to their own account
    let patientId = dto.patientId;
    if (user?.role === 'PATIENT') {
      const patient = await this.prisma.patient.findUnique({
        where: { userId: user.sub },
      });
      if (!patient) {
        throw new BadRequestException('Profil pasien belum lengkap');
      }
      patientId = patient.id;
    }

    const aptDate = new Date(dto.appointmentDate);

    // Concurrency safe transaction: check double booking & create appointment + queue
    return this.prisma.$transaction(async (tx) => {
      // 1. Prevent double booking for same doctor at same date & time
      const existing = await tx.appointment.findFirst({
        where: {
          doctorId: dto.doctorId,
          appointmentDate: aptDate,
          appointmentTime: dto.appointmentTime,
          status: { notIn: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW] },
        },
      });

      if (existing) {
        throw new ConflictException('Dokter sudah memiliki jadwal di waktu tersebut.');
      }

      // 2. Create appointment
      const appointment = await tx.appointment.create({
        data: {
          patientId: patientId,
          doctorId: dto.doctorId,
          clinicId: dto.clinicId,
          scheduleId: dto.scheduleId,
          appointmentDate: aptDate,
          appointmentTime: dto.appointmentTime,
          notes: dto.notes,
          status: AppointmentStatus.CONFIRMED,
        },
      });

      // 3. Concurrency-safe queue number generation for this doctor and date
      const startOfDay = new Date(new Date(aptDate).setHours(0, 0, 0, 0));
      const endOfDay = new Date(new Date(aptDate).setHours(23, 59, 59, 999));

      const lastQueue = await tx.queue.findFirst({
        where: {
          doctorId: dto.doctorId,
          date: { gte: startOfDay, lte: endOfDay },
        },
        orderBy: { queueNumber: 'desc' },
      });

      const nextQueueNumber = (lastQueue?.queueNumber || 0) + 1;

      const queue = await tx.queue.create({
        data: {
          clinicId: dto.clinicId,
          doctorId: dto.doctorId,
          patientId: patientId,
          appointmentId: appointment.id,
          queueNumber: nextQueueNumber,
          date: new Date(),
          status: 'WAITING',
        },
      });

      // 4. Create Notification
      const patient = await tx.patient.findUnique({
        where: { id: patientId },
        select: { userId: true },
      });

      if (patient) {
        await tx.notification.create({
          data: {
            userId: patient.userId,
            type: 'APPOINTMENT_REMINDER',
            title: 'Janji Temu Dikonfirmasi',
            message: `Janji temu Anda telah dikonfirmasi untuk tanggal ${dto.appointmentDate} pukul ${dto.appointmentTime}. Nomor antrean: #${nextQueueNumber}`,
          },
        });
      }

      // 5. Record Audit Log
      if (user?.sub) {
        await tx.auditLog.create({
          data: {
            userId: user.sub,
            action: 'APPOINTMENT_CREATED',
            resource: 'Appointment',
            details: { appointmentId: appointment.id, doctorId: dto.doctorId, patientId },
          },
        });
      }

      return {
        ...appointment,
        queue,
      };
    });
  }

  async update(id: string, dto: UpdateAppointmentDto, user?: any) {
    const existing = await this.findOne(id, user);

    const updated = await this.prisma.appointment.update({
      where: { id },
      data: {
        status: dto.status,
        appointmentDate: dto.appointmentDate ? new Date(dto.appointmentDate) : undefined,
        appointmentTime: dto.appointmentTime,
        notes: dto.notes,
      },
      include: {
        patient: { include: { user: { select: { name: true } } } },
        doctor: { include: { user: { select: { name: true } } } },
        queue: true,
      },
    });

    if (user?.sub) {
      await this.prisma.auditLog.create({
        data: {
          userId: user.sub,
          action: 'APPOINTMENT_UPDATED',
          resource: 'Appointment',
          details: { appointmentId: id, status: dto.status },
        },
      });
    }

    return updated;
  }

  async remove(id: string, user?: any) {
    await this.findOne(id, user);
    return this.prisma.appointment.delete({
      where: { id },
    });
  }
}
