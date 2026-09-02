import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorDto, UpdateDoctorDto } from './dto/doctor.dto';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/schedule.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async findAll(pagination: PaginationDto) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 20;
    const skip = (page - 1) * limit;

    const where = pagination.search
      ? {
          OR: [
            { specialization: { contains: pagination.search, mode: 'insensitive' as const } },
            { user: { name: { contains: pagination.search, mode: 'insensitive' as const } } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.doctor.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true, latitude: true, longitude: true },
          },
          clinic: true,
          schedules: { where: { isActive: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.doctor.count({ where }),
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
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, latitude: true, longitude: true } },
        clinic: true,
        schedules: true,
      },
    });

    if (!doctor) {
      throw new NotFoundException('Dokter tidak ditemukan');
    }

    return doctor;
  }

  async getDoctorByUserId(userId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        clinic: true,
        schedules: true,
      },
    });

    if (!doctor) {
      throw new NotFoundException('Profil dokter tidak ditemukan');
    }

    return doctor;
  }

  async create(dto: CreateDoctorDto) {
    return this.prisma.doctor.create({
      data: dto,
      include: {
        user: { select: { name: true, email: true } },
        clinic: true,
      },
    });
  }

  async update(id: string, dto: UpdateDoctorDto) {
    await this.findOne(id);
    return this.prisma.doctor.update({
      where: { id },
      data: dto,
      include: {
        user: { select: { name: true, email: true } },
        clinic: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.doctor.delete({
      where: { id },
    });
  }

  // --- Doctor Schedules ---

  async getSchedules(doctorId: string) {
    await this.findOne(doctorId);
    return this.prisma.doctorSchedule.findMany({
      where: { doctorId },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async createSchedule(doctorId: string, dto: CreateScheduleDto) {
    await this.findOne(doctorId);
    return this.prisma.doctorSchedule.create({
      data: {
        doctorId,
        ...dto,
      },
    });
  }

  async updateSchedule(scheduleId: string, dto: UpdateScheduleDto) {
    const schedule = await this.prisma.doctorSchedule.findUnique({
      where: { id: scheduleId },
    });
    if (!schedule) {
      throw new NotFoundException('Jadwal tidak ditemukan');
    }

    return this.prisma.doctorSchedule.update({
      where: { id: scheduleId },
      data: dto,
    });
  }

  async deleteSchedule(scheduleId: string) {
    const schedule = await this.prisma.doctorSchedule.findUnique({
      where: { id: scheduleId },
    });
    if (!schedule) {
      throw new NotFoundException('Jadwal tidak ditemukan');
    }

    return this.prisma.doctorSchedule.delete({
      where: { id: scheduleId },
    });
  }
}
