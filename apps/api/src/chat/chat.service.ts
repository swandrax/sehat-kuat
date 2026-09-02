import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatSessionDto, CreateChatMessageDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getSessions(userId: string) {
    return this.prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async getSession(id: string, userId: string) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!session) {
      throw new NotFoundException('Sesi chat tidak ditemukan');
    }

    if (session.userId !== userId) {
      throw new ForbiddenException('Akses ditolak ke sesi percakapan ini');
    }

    return session;
  }

  async createSession(userId: string, dto: CreateChatSessionDto) {
    return this.prisma.chatSession.create({
      data: {
        userId,
        title: dto.title || 'Konsultasi Baru',
      },
    });
  }

  async addMessage(sessionId: string, userId: string, dto: CreateChatMessageDto) {
    await this.getSession(sessionId, userId);

    const message = await this.prisma.chatMessage.create({
      data: {
        sessionId,
        role: dto.role,
        content: dto.content,
      },
    });

    await this.prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async deleteSession(sessionId: string, userId: string) {
    await this.getSession(sessionId, userId);
    return this.prisma.chatSession.delete({
      where: { id: sessionId },
    });
  }
}
