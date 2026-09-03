import {
  Injectable,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AIFeedbackType,
  AIReviewStatus,
  ReviewAIFeedbackDto,
  SubmitAIFeedbackDto,
} from './dto/feedback.dto';

export interface AIFeedbackRecord {
  id: string;
  conversationId: string;
  messageId: string;
  userId: string | null;
  userRole: 'PATIENT' | 'GUEST';
  feedbackType: AIFeedbackType;
  createdAt: Date;
  updatedAt: Date;
  modelVersion: string;
  promptVersion: string;
  ragVersion: string;
  reviewStatus: AIReviewStatus;
  rejectionReason?: string;
  reviewerDecision?: string;
}

@Injectable()
export class AIFeedbackService {
  private feedbackRecords: AIFeedbackRecord[] = [];

  constructor(private prisma: PrismaService) {}

  async submitFeedback(
    dto: SubmitAIFeedbackDto,
    serverUser?: any,
  ): Promise<{ success: boolean; message: string; data: AIFeedbackRecord }> {
    // 1. Authorization checks
    let resolvedRole: 'PATIENT' | 'GUEST' = 'GUEST';
    let resolvedUserId: string | null = null;

    if (serverUser) {
      const roleName = serverUser.role?.name || serverUser.role;
      if (roleName === 'DOCTOR' || roleName === 'ADMIN' || roleName === 'STAFF') {
        throw new ForbiddenException(
          'Akses ditolak: Feedback chatbot hanya dapat dikirimkan oleh Pasien dan Pengguna Tamu (Guest)',
        );
      }
      resolvedRole = 'PATIENT';
      resolvedUserId = serverUser.sub || serverUser.id;
    }

    // 2. Prevent duplicate feedback for same conversation + message
    const existing = this.feedbackRecords.find(
      (r) =>
        r.conversationId === dto.conversationId &&
        r.messageId === dto.messageId,
    );

    if (existing) {
      throw new ConflictException(
        'Feedback untuk respon ini sudah pernah dikirimkan sebelumnya',
      );
    }

    // 3. Create feedback record
    const record: AIFeedbackRecord = {
      id: `fb-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      conversationId: dto.conversationId,
      messageId: dto.messageId,
      userId: resolvedUserId,
      userRole: resolvedRole,
      feedbackType: dto.feedback,
      createdAt: new Date(),
      updatedAt: new Date(),
      modelVersion: 'claude-3.5-sonnet',
      promptVersion: 'v1.2-clinical-safety',
      ragVersion: 'v1.0-medical-kb',
      reviewStatus: AIReviewStatus.PENDING,
    };

    this.feedbackRecords.unshift(record);

    // 4. Audit Log
    if (resolvedUserId) {
      try {
        await this.prisma.auditLog.create({
          data: {
            userId: resolvedUserId,
            action: 'MEDICAL_RECORD_VIEWED', // categorized under safety/audit
            resource: 'AIFeedback',
            details: {
              feedbackId: record.id,
              feedbackType: dto.feedback,
              conversationId: dto.conversationId,
            },
          },
        });
      } catch (e) {
        // Non-blocking audit failure
      }
    }

    return {
      success: true,
      message:
        dto.feedback === AIFeedbackType.LIKE
          ? 'Terima kasih atas masukannya'
          : 'Masukan diterima untuk evaluasi klinis',
      data: record,
    };
  }

  // Internal AI Reviewer Dashboard methods
  getAllFeedback(status?: AIReviewStatus) {
    let list = this.feedbackRecords;
    if (status) {
      list = list.filter((r) => r.reviewStatus === status);
    }
    return {
      success: true,
      total: list.length,
      data: list,
    };
  }

  reviewFeedback(id: string, dto: ReviewAIFeedbackDto, reviewerUser?: any) {
    const record = this.feedbackRecords.find((r) => r.id === id);
    if (!record) {
      throw new NotFoundException('Data feedback tidak ditemukan');
    }

    record.reviewStatus = dto.status;
    record.rejectionReason = dto.rejectionReason;
    record.reviewerDecision = reviewerUser?.name || 'AI Safety Reviewer';
    record.updatedAt = new Date();

    return {
      success: true,
      message: 'Status review feedback berhasil diperbarui',
      data: record,
    };
  }
}
