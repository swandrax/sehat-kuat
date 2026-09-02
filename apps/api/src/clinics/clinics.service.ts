import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClinicDto, UpdateClinicDto } from './dto/clinic.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ClinicsService {
  constructor(private prisma: PrismaService) {}

  async findAll(pagination: PaginationDto) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 20;
    const skip = (page - 1) * limit;

    const where = pagination.search
      ? {
          OR: [
            { name: { contains: pagination.search, mode: 'insensitive' as const } },
            { address: { contains: pagination.search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.clinic.findMany({
        where,
        skip,
        take: limit,
        include: {
          doctors: {
            include: {
              user: { select: { name: true, email: true } },
            },
          },
        },
        orderBy: { name: 'asc' },
      }),
      this.prisma.clinic.count({ where }),
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
    const clinic = await this.prisma.clinic.findUnique({
      where: { id },
      include: {
        doctors: {
          include: {
            user: { select: { name: true, email: true } },
            schedules: true,
          },
        },
      },
    });

    if (!clinic) {
      throw new NotFoundException('Klinik tidak ditemukan');
    }

    return clinic;
  }

  async create(dto: CreateClinicDto) {
    return this.prisma.clinic.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateClinicDto) {
    await this.findOne(id);
    return this.prisma.clinic.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.clinic.delete({
      where: { id },
    });
  }
}
