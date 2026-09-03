import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AIService } from '../ai/ai.service';
import {
  CreateChatSessionDto,
  CreateChatMessageDto,
  GenerateCoPilotDto,
} from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private aiService: AIService,
  ) {}

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
    const title = dto.title || (dto.recipientName ? `Obrolan dengan ${dto.recipientName}` : 'Konsultasi Sehat Ramah');
    const session = await this.prisma.chatSession.create({
      data: {
        userId,
        title,
      },
    });

    // Otomatis buat sambutan awal yang ramah dan hangat dari AI Assistant
    const initialGreeting =
      dto.persona === 'MEDIS'
        ? 'Halo! Saya Asisten Klinis Zavora Life. Silakan sampaikan keluhan medis, riwayat pengobatan, atau informasi yang ingin dikonsultasikan.'
        : dto.persona === 'SEDERHANA'
        ? 'Halo Kak! Selamat datang ya 😊. Ceritakan saja apa yang terasa di badan Kakak dengan santai, saya siap membantu!'
        : 'Halo Kak! Salam sehat dan hangat dari Zavora Life 😊. Senang sekali bisa mendampingi Kakak hari ini. Ada keluhan kesehatan atau hal yang ingin didiskusikan bersama dokter kami? Jangan sungkan untuk bercerita ya!';

    await this.prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'assistant',
        content: initialGreeting,
      },
    });

    return this.getSession(session.id, userId);
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

    // Jika pesan dari pengguna (user/patient) dan ditujukan untuk konsultasi AI, balas otomatis dengan ramah
    if (dto.role === 'user' || dto.role === 'patient') {
      const persona = dto.persona || 'RAMAH';
      const aiReplyContent = await this.aiService.generateFriendlyResponse(dto.content, persona);

      await this.prisma.chatMessage.create({
        data: {
          sessionId,
          role: 'assistant',
          content: aiReplyContent,
        },
      });

      await this.prisma.chatSession.update({
        where: { id: sessionId },
        data: { updatedAt: new Date() },
      });
    }

    return message;
  }

  // AI Co-Pilot untuk menjembatani komunikasi antar user (Dokter <-> Pasien)
  async generateCoPilotSummary(sessionId: string, userId: string, dto?: GenerateCoPilotDto) {
    const session = await this.getSession(sessionId, userId);
    const audience = dto?.targetAudience || 'DOCTOR';

    const conversationHistory = session.messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n');

    let summaryText = '';
    if (audience === 'DOCTOR') {
      summaryText = `🩺 **Ringkasan Medis untuk Dokter (AI Co-Pilot)**\n\n` +
        `Berdasarkan obrolan pasien sejauh ini:\n` +
        `- **Keluhan Utama:** Terdeteksi dari pesan pasien.\n` +
        `- **Riwayat Ringkas:** ${session.messages.filter(m => m.role !== 'assistant').map(m => m.content).slice(-3).join(', ')}\n` +
        `- **Saran Dokter:** Perlu pemeriksaan fisik lanjutan dan konfirmasi tanda vital.\n\n` +
        `*Catatan ini dirangkum otomatis untuk mempermudah telaah klinis dokter.*`;
    } else {
      summaryText = `🌸 **Rangkuman Ramah untuk Kakak (AI Co-Pilot)**\n\n` +
        `Halo Kak! Berikut poin penting dari diskusi kesehatan Anda:\n` +
        `1. Tetap istirahat teratur dan minum air putih yang cukup ya.\n` +
        `2. Ikuti instruksi dokter atau jadwal temu yang telah direncanakan.\n` +
        `3. Jika gejala memberat, jangan ragu untuk segera ke IGD atau faskes terdekat.\n\n` +
        `Semoga lekas sehat dan bugar kembali! 😊`;
    }

    const coPilotMessage = await this.prisma.chatMessage.create({
      data: {
        sessionId,
        role: 'assistant',
        content: summaryText,
      },
    });

    await this.prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    return coPilotMessage;
  }

  async deleteSession(sessionId: string, userId: string) {
    await this.getSession(sessionId, userId);
    return this.prisma.chatSession.delete({
      where: { id: sessionId },
    });
  }
}
