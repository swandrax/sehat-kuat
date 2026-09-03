import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import {
  ConnectInsuranceDto,
  EvaluateClaimDto,
  SubmitClaimDto,
  AdjudicateClaimDto,
} from './dto/insurance.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { IdempotencyGuard } from '../security/idempotency.guard';
import { ClaimStatus } from '@prisma/client';

@Controller('api/v1/insurance')
export class InsuranceController {
  constructor(private readonly insuranceService: InsuranceService) {}

  @Get('policies')
  getAllPolicies(@Request() req: any) {
    return this.insuranceService.getAllPolicies(req.user?.id);
  }

  @Get('policies/:code')
  getPolicyByCode(@Param('code') code: string) {
    return this.insuranceService.getPolicyByCode(code);
  }

  @Post('connect')
  @UseGuards(AuthGuard, IdempotencyGuard)
  connectPolicy(@Body() dto: ConnectInsuranceDto, @Request() req: any) {
    return this.insuranceService.connectPolicy(dto, req.user?.id);
  }

  // Autra-AI Agentic Policy Claim Evaluation
  @Post('evaluate-claim')
  @UseGuards(AuthGuard)
  evaluateClaim(@Body() dto: EvaluateClaimDto) {
    return this.insuranceService.evaluateClaimWithAutraAI(dto);
  }

  // End-to-End Claim Submission with AUTRA OCR + FDS Velocity checks
  @Post('claims')
  @UseGuards(AuthGuard, IdempotencyGuard)
  submitClaim(@Body() dto: SubmitClaimDto, @Request() req: any) {
    return this.insuranceService.submitClaim(dto, req.user);
  }

  // Query claims list (Patient gets own, Officer/Admin gets all)
  @Get('claims')
  @UseGuards(AuthGuard)
  getClaims(@Request() req: any, @Query('status') status?: ClaimStatus) {
    return this.insuranceService.getClaims(req.user, status);
  }

  // Query single claim detail with documents, extraction traces, and FDS risk score
  @Get('claims/:id')
  @UseGuards(AuthGuard)
  getClaimById(@Param('id') id: string, @Request() req: any) {
    return this.insuranceService.getClaimById(id, req.user);
  }

  // Adjudicate claim by Claims Officer / Admin (Human-in-the-Loop)
  @Patch('claims/:id/adjudicate')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'CLAIMS_OFFICER', 'STAFF')
  adjudicateClaim(
    @Param('id') id: string,
    @Body() dto: AdjudicateClaimDto,
    @Request() req: any,
  ) {
    return this.insuranceService.adjudicateClaim(id, dto, req.user);
  }

  // Official Printable A4 PDF claim sheet payload
  @Get('claims/:id/pdf-export')
  @UseGuards(AuthGuard)
  getClaimPdfData(@Param('id') id: string) {
    return this.insuranceService.getClaimPdfData(id);
  }
}
