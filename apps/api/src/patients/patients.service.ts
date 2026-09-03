import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async findAll(pagination: PaginationDto) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 20;
    const skip = (page - 1) * limit;

    const andConditions: any[] = [];

    if (pagination.search) {
      andConditions.push({
        user: {
          OR: [
            { name: { contains: pagination.search, mode: 'insensitive' as const } },
            { email: { contains: pagination.search, mode: 'insensitive' as const } },
            { phone: { contains: pagination.search, mode: 'insensitive' as const } },
          ],
        },
      });
    }

    if (pagination.letter) {
      andConditions.push({
        user: {
          name: {
            startsWith: pagination.letter.trim(),
            mode: 'insensitive' as const,
          },
        },
      });
    }

    const where: any = andConditions.length > 0 ? { AND: andConditions } : {};

    const orderBy: any = {};
    if (pagination.sortBy === 'name') {
      orderBy.user = { name: pagination.order || 'asc' };
    } else {
      orderBy.createdAt = pagination.order || 'desc';
    }

    const [data, total] = await Promise.all([
      this.prisma.patient.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true, latitude: true, longitude: true },
          },
        },
        orderBy,
      }),
      this.prisma.patient.count({ where }),
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

  async findOne(id: string, currentUser?: any) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, latitude: true, longitude: true } },
        allergies: true,
        vitalSigns: { take: 5, orderBy: { measuredAt: 'desc' } },
        medicalRecords: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { doctor: { include: { user: { select: { name: true } } } } },
        },
      },
    });

    if (!patient) {
      throw new NotFoundException('Pasien tidak ditemukan');
    }

    // RBAC ownership check: patient can only view own record unless doctor/staff/admin
    if (
      currentUser &&
      currentUser.role === 'PATIENT' &&
      patient.userId !== currentUser.sub
    ) {
      throw new ForbiddenException('Akses ditolak: Anda hanya dapat mengakses profil Anda sendiri');
    }

    return patient;
  }

  async getPatientByUserId(userId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, latitude: true, longitude: true } },
        allergies: true,
        vitalSigns: { take: 5, orderBy: { measuredAt: 'desc' } },
      },
    });

    if (!patient) {
      throw new NotFoundException('Profil pasien tidak ditemukan');
    }

    return patient;
  }

  async create(dto: CreatePatientDto) {
    return this.prisma.patient.create({
      data: {
        userId: dto.userId,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
        gender: dto.gender,
        address: dto.address,
        emergencyContact: dto.emergencyContact,
        bloodType: dto.bloodType,
      },
      include: {
        user: { select: { name: true, email: true } },
      },
    });
  }

  async update(id: string, dto: UpdatePatientDto, currentUser?: any) {
    const patient = await this.findOne(id, currentUser);

    return this.prisma.patient.update({
      where: { id },
      data: {
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        gender: dto.gender,
        address: dto.address,
        emergencyContact: dto.emergencyContact,
        bloodType: dto.bloodType,
      },
      include: {
        user: { select: { name: true, email: true } },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.patient.delete({
      where: { id },
    });
  }
}
