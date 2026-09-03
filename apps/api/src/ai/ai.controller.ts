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

import { KnowledgeService } from './knowledge.service';

@Controller('api/v1/ai')
export class AIController {
  constructor(
    private readonly aiService: AIService,
    private readonly feedbackService: AIFeedbackService,
    private readonly knowledgeService: KnowledgeService,
  ) {}

  @Get('knowledge/diseases')
  searchDiseases(@Query('q') query?: string, @Query('limit') limit?: string) {
    return this.knowledgeService.searchDiseases(query || '', limit ? parseInt(limit, 10) : 10);
  }

  @Get('knowledge/medicines')
  searchMedicines(@Query('q') query?: string, @Query('limit') limit?: string) {
    return this.knowledgeService.searchMedicines(query || '', limit ? parseInt(limit, 10) : 10);
  }

  @Get('knowledge/rag')
  getRAGContext(@Query('prompt') prompt: string) {
    return {
      prompt,
      context: this.knowledgeService.getRAGContext(prompt || ''),
    };
  }

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
    @Query('persona') persona?: string,
    @Query('customInstructions') customInstructions?: string,
  ): Observable<MessageEvent> {
    return this.aiService.streamConsultation(
      prompt || 'Halo',
      userId,
      persona || 'RAMAH',
      customInstructions,
    );
  }

  // Direct Friendly Chat / Custom Obrolan
  @Post('friendly-chat')
  async friendlyChat(
    @Body() body: { prompt: string; persona?: string; customInstructions?: string },
  ) {
    const reply = await this.aiService.generateFriendlyResponse(
      body.prompt || 'Halo',
      body.persona || 'RAMAH',
      body.customInstructions,
    );
    return { reply };
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
