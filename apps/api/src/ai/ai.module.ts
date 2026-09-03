import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { AIController } from './ai.controller';
import { AIFeedbackService } from './feedback.service';
import { KnowledgeService } from './knowledge.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AIService, AIFeedbackService, KnowledgeService],
  controllers: [AIController],
  exports: [AIService, AIFeedbackService, KnowledgeService],
})
export class AIModule {}
