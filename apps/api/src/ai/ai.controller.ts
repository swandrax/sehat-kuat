import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Sse,
  MessageEvent,
  Request,
} from '@nestjs/common';
import { AIService } from './ai.service';
import { AIFeedbackService } from './feedback.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { Observable } from 'rxjs';
import {
  AIReviewStatus,
  ReviewAIFeedbackDto,
  SubmitAIFeedbackDto,
} from './dto/feedback.dto';

@Controller('api/v1/ai')
export class AIController {
  constructor(
    private readonly aiService: AIService,
    private readonly feedbackService: AIFeedbackService,
  ) {}

  @Get('telemetry')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  getTelemetry() {
    return this.aiService.getRecentLogs();
  }

  // SSE Stream for AI medical consultation
  @Sse('consultation/stream')
  streamConsultation(
    @Query('prompt') prompt: string,
    @Query('userId') userId?: string,
  ): Observable<MessageEvent> {
    return this.aiService.streamConsultation(prompt || 'Halo', userId);
  }

  // Pre-consultation Triage & SOAP suggestion
  @Post('triage')
  @UseGuards(AuthGuard)
  async analyzeTriage(@Request() req: any, @Query('symptoms') querySymptoms?: string) {
    const symptoms = req.body?.symptoms || querySymptoms || 'Keluhan umum kesehatan';
    return this.aiService.generateMedicalTriageSummary(symptoms);
  }

  // AI Response Feedback (Like / Unlike)
  @Post('feedback')
  async submitFeedback(@Body() dto: SubmitAIFeedbackDto, @Request() req: any) {
    // Optionally resolve user if token is attached (patients), otherwise guest
    const serverUser = req?.user || null;
    return this.feedbackService.submitFeedback(dto, serverUser);
  }

  // Internal AI Reviewer Dashboard: List feedback queue
  @Get('feedback')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  getAllFeedback(@Query('status') status?: AIReviewStatus) {
    return this.feedbackService.getAllFeedback(status);
  }

  // Internal AI Reviewer Dashboard: Review & update training eligibility
  @Patch('feedback/:id/review')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  reviewFeedback(
    @Param('id') id: string,
    @Body() dto: ReviewAIFeedbackDto,
    @Request() req: any,
  ) {
    return this.feedbackService.reviewFeedback(id, dto, req.user);
  }
}
