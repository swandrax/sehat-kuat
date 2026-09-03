import {
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Sse,
  MessageEvent,
  Request,
} from '@nestjs/common';
import { AIService } from './ai.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { Observable } from 'rxjs';

@Controller('api/v1/ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

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
}
