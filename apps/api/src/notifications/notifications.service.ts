import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from './dto/notification.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AppEventsService } from '../common/events/events.service';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private events: AppEventsService,
  ) {}

  async findAll(pagination: PaginationDto, user?: any) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (user?.sub) {
      where.userId = user.sub;
    }

    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
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
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notifikasi tidak ditemukan');
    }

    return notification;
  }

  async create(dto: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: dto,
    });

    // Broadcast user-specific SSE notification
    this.events.emit({
      type: 'NOTIFICATION_CREATED',
      targetId: dto.userId,
      payload: notification,
    });

    return notification;
  }

  async update(id: string, dto: UpdateNotificationDto) {
    await this.findOne(id);
    return this.prisma.notification.update({
      where: { id },
      data: dto,
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.notification.delete({
      where: { id },
    });
  }
}
