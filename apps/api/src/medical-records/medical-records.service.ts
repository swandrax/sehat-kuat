import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateMedicalRecordDto,
  UpdateMedicalRecordDto,
} from './dto/medical-record.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class MedicalRecordsService {
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
      this.prisma.medicalRecord.findMany({
        where,
        skip,
        take: limit,
        include: {
          patient: { include: { user: { select: { name: true, phone: true } } } },
          doctor: { include: { user: { select: { name: true } } } },
          diagnoses: true,
          prescriptions: { include: { items: true } },
          vitalSigns: true,
          labResults: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.medicalRecord.count({ where }),
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
    const record = await this.prisma.medicalRecord.findUnique({
      where: { id },
      include: {
        patient: { include: { user: { select: { name: true, email: true, phone: true } } } },
        doctor: { include: { user: { select: { name: true } }, clinic: true } },
        diagnoses: true,
        prescriptions: { include: { items: true } },
        vitalSigns: true,
        labResults: true,
      },
    });

    if (!record) {
      throw new NotFoundException('Rekam medis tidak ditemukan');
    }

    // Strict Authorization check
    if (user?.role === 'PATIENT' && record.patient.userId !== user.sub) {
      throw new ForbiddenException('Akses ditolak ke rekam medis ini');
    }

    // Record Audit Log for sensitive medical record viewing
    if (user?.sub) {
      await this.prisma.auditLog.create({
        data: {
          userId: user.sub,
          action: 'MEDICAL_RECORD_VIEWED',
          resource: 'MedicalRecord',
          details: { recordId: id, patientId: record.patientId },
        },
      });
    }

    return record;
  }

  async create(dto: CreateMedicalRecordDto, user?: any) {
    const record = await this.prisma.medicalRecord.create({
      data: {
        patientId: dto.patientId,
        doctorId: dto.doctorId,
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
      include: {
        diagnoses: true,
      },
    });

    // Record Audit Log
    if (user?.sub) {
      await this.prisma.auditLog.create({
        data: {
          userId: user.sub,
          action: 'MEDICAL_RECORD_CREATED',
          resource: 'MedicalRecord',
          details: { recordId: record.id, patientId: dto.patientId },
        },
      });
    }

    return record;
  }

  async update(id: string, dto: UpdateMedicalRecordDto, user?: any) {
    await this.findOne(id, user);

    const updated = await this.prisma.medicalRecord.update({
      where: { id },
      data: dto,
      include: { diagnoses: true },
    });

    // Record Audit Log
    if (user?.sub) {
      await this.prisma.auditLog.create({
        data: {
          userId: user.sub,
          action: 'MEDICAL_RECORD_UPDATED',
          resource: 'MedicalRecord',
          details: { recordId: id },
        },
      });
    }

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.medicalRecord.delete({
      where: { id },
    });
  }
}
