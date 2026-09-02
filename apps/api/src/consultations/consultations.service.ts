import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompleteConsultationDto } from './dto/consultation.dto';
import { AppEventsService } from '../common/events/events.service';
import { AppointmentStatus, QueueStatus } from '@prisma/client';

@Injectable()
export class ConsultationsService {
  constructor(
    private prisma: PrismaService,
    private events: AppEventsService,
  ) {}

  async startConsultation(appointmentId: string, doctorUserId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId: doctorUserId },
    });
    if (!doctor) throw new NotFoundException('Profil dokter tidak ditemukan');

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { queue: true },
    });
    if (!appointment) throw new NotFoundException('Janji temu tidak ditemukan');

    return this.prisma.$transaction(async (tx) => {
      const updatedApt = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: AppointmentStatus.CHECKED_IN },
      });

      if (appointment.queue) {
        await tx.queue.update({
          where: { id: appointment.queue.id },
          data: {
            status: QueueStatus.IN_SERVICE,
            calledAt: new Date(),
          },
        });
      }

      this.events.emit({
        type: 'QUEUE_UPDATED',
        targetId: doctor.id,
        payload: { action: 'IN_SERVICE', appointmentId },
      });

      return updatedApt;
    });
  }

  async completeConsultation(dto: CompleteConsultationDto, doctorUserId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId: doctorUserId },
    });
    if (!doctor) throw new NotFoundException('Profil dokter tidak ditemukan');

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: dto.appointmentId },
      include: { patient: true, queue: true },
    });
    if (!appointment) throw new NotFoundException('Janji temu tidak ditemukan');

    return this.prisma.$transaction(async (tx) => {
      // 1. Update appointment status
      const updatedApt = await tx.appointment.update({
        where: { id: dto.appointmentId },
        data: { status: AppointmentStatus.COMPLETED },
      });

      // 2. Update queue status
      if (appointment.queue) {
        await tx.queue.update({
          where: { id: appointment.queue.id },
          data: {
            status: QueueStatus.COMPLETED,
            completedAt: new Date(),
          },
        });
      }

      // 3. Create Medical Record
      const medicalRecord = await tx.medicalRecord.create({
        data: {
          patientId: appointment.patientId,
          doctorId: doctor.id,
          appointmentId: dto.appointmentId,
          chiefComplaint: dto.chiefComplaint,
          clinicalNotes: dto.clinicalNotes,
          treatment: dto.treatment,
          followUpNotes: dto.followUpNotes,
          diagnoses: dto.diagnoses
            ? {
                create: dto.diagnoses.map((d) => ({
                  code: d.code,
                  name: d.name,
                  description: d.description,
                })),
              }
            : undefined,
        },
      });

      // 4. Create Prescription if items provided
      let prescription = null;
      if (dto.prescriptionItems && dto.prescriptionItems.length > 0) {
        prescription = await tx.prescription.create({
          data: {
            patientId: appointment.patientId,
            doctorId: doctor.id,
            medicalRecordId: medicalRecord.id,
            notes: 'Resep elektronik dari konsultasi',
            status: 'ACTIVE',
            items: {
              create: dto.prescriptionItems.map((item) => ({
                medicineName: item.medicineName,
                dosage: item.dosage,
                frequency: item.frequency,
                duration: item.duration,
                instructions: item.instructions,
                quantity: item.quantity || 1,
              })),
            },
          },
          include: { items: true },
        });
      }

      // 5. Send notification to patient
      await tx.notification.create({
        data: {
          userId: appointment.patient.userId,
          type: 'PRESCRIPTION_NOTIFICATION',
          title: 'Konsultasi Selesai & Resep Tersedia',
          message: `Konsultasi dengan ${doctor.specialization} telah selesai. Rekam medis dan resep obat Anda telah diperbarui.`,
        },
      });

      // 6. Record Audit Log
      await tx.auditLog.create({
        data: {
          userId: doctorUserId,
          action: 'MEDICAL_RECORD_CREATED',
          resource: 'Consultation',
          details: {
            appointmentId: dto.appointmentId,
            medicalRecordId: medicalRecord.id,
            hasPrescription: !!prescription,
          },
        },
      });

      this.events.emit({
        type: 'QUEUE_UPDATED',
        targetId: doctor.id,
        payload: { action: 'COMPLETED', appointmentId: dto.appointmentId },
      });

      return {
        appointment: updatedApt,
        medicalRecord,
        prescription,
      };
    });
  }
}
