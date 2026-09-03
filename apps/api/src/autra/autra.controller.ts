import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AutraService } from './autra.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { IdempotencyGuard } from '../security/idempotency.guard';

export class AnalyzeDocumentDto {
  fileName: string;
  fileContentBase64?: string;
  rawText?: string;
  fileSize?: number;
}

export class EvaluatePolicyDto {
  policyIdOrCode: string;
  claimAmount: number;
  diagnosisCode?: string;
}

@Controller('api/v1/autra')
export class AutraController {
  constructor(private readonly autraService: AutraService) {}

  @Post('analyze-document')
  @UseGuards(AuthGuard)
  async analyzeDocument(@Body() dto: AnalyzeDocumentDto) {
    const analysis = await this.autraService.processClaimDocument(
      dto.fileName,
      dto.rawText,
      dto.fileSize,
    );
    return {
      success: true,
      message: 'Dokumen berhasil dianalisis oleh AUTRA OCR & NLP Engine',
      data: analysis,
    };
  }

  @Post('evaluate-policy')
  @UseGuards(AuthGuard, IdempotencyGuard)
  async evaluatePolicy(@Body() dto: EvaluatePolicyDto) {
    const evaluation = await this.autraService.evaluatePolicyCoverage(
      dto.policyIdOrCode,
      dto.claimAmount,
      dto.diagnosisCode,
    );
    return {
      success: true,
      data: evaluation,
    };
  }
}
