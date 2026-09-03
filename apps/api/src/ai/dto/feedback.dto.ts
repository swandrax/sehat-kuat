import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum AIFeedbackType {
  LIKE = 'LIKE',
  UNLIKE = 'UNLIKE',
}

export enum AIReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  NEEDS_REVIEW = 'NEEDS_REVIEW',
  TRAINING_ELIGIBLE = 'TRAINING_ELIGIBLE',
  TRAINING_EXCLUDED = 'TRAINING_EXCLUDED',
}

export class SubmitAIFeedbackDto {
  @IsString()
  @IsNotEmpty()
  conversationId!: string;

  @IsString()
  @IsNotEmpty()
  messageId!: string;

  @IsEnum(AIFeedbackType)
  feedback!: AIFeedbackType;

  @IsOptional()
  @IsString()
  clientSessionId?: string;
}

export class ReviewAIFeedbackDto {
  @IsEnum(AIReviewStatus)
  status!: AIReviewStatus;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
