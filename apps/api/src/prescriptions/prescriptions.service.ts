import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePrescriptionDto,
  UpdatePrescriptionDto,
} from './dto/prescription.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PrescriptionsService {
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
    } else if (user?.role === 'DOCTOR') {
      const doctor = await this.prisma.doctor.findUnique({
        where: { userId: user.sub },
      });
      if (doctor) where.doctorId = doctor.id;
    }

    const [data, total] = await Promise.all([
      this.prisma.prescription.findMany({
        where,
        skip,
        take: limit,
        include: {
          patient: { include: { user: { select: { name: true } } } },
          doctor: { include: { user: { select: { name: true } } } },
          items: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.prescription.count({ where }),
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
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
      include: {
        patient: { include: { user: { select: { name: true, phone: true } } } },
        doctor: { include: { user: { select: { name: true } } } },
        items: true,
      },
    });

    if (!prescription) {
      throw new NotFoundException('Resep tidak ditemukan');
    }

    if (user?.role === 'PATIENT' && prescription.patient.userId !== user.sub) {
      throw new ForbiddenException('Akses ditolak ke resep ini');
    }

    return prescription;
  }

  async create(dto: CreatePrescriptionDto, user?: any) {
    const prescription = await this.prisma.prescription.create({
      data: {
        patientId: dto.patientId,
        doctorId: dto.doctorId,
        medicalRecordId: dto.medicalRecordId,
        notes: dto.notes,
        items: {
          create: dto.items.map((item) => ({
            medicineName: item.medicineName,
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration,
            instructions: item.instructions,
            quantity: item.quantity || 1,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Record Audit Log
    if (user?.sub) {
      await this.prisma.auditLog.create({
        data: {
          userId: user.sub,
          action: 'PRESCRIPTION_CREATED',
          resource: 'Prescription',
          details: { prescriptionId: prescription.id, patientId: dto.patientId },
        },
      });
    }

    return prescription;
  }

  async update(id: string, dto: UpdatePrescriptionDto, user?: any) {
    await this.findOne(id, user);

    const updated = await this.prisma.prescription.update({
      where: { id },
      data: dto,
      include: { items: true },
    });

    if (user?.sub) {
      await this.prisma.auditLog.create({
        data: {
          userId: user.sub,
          action: 'PRESCRIPTION_UPDATED',
          resource: 'Prescription',
          details: { prescriptionId: id, status: dto.status },
        },
      });
    }

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.prescription.delete({
      where: { id },
    });
  }
}
