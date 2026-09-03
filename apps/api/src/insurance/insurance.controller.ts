import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { ConnectInsuranceDto, EvaluateClaimDto } from './dto/insurance.dto';

@Controller('api/v1/insurance')
export class InsuranceController {
  constructor(private readonly insuranceService: InsuranceService) {}

  @Get('policies')
  getAllPolicies() {
    return this.insuranceService.getAllPolicies();
  }

  @Get('policies/:code')
  getPolicyByCode(@Param('code') code: string) {
    return this.insuranceService.getPolicyByCode(code);
  }

  @Post('connect')
  connectPolicy(@Body() dto: ConnectInsuranceDto) {
    return this.insuranceService.connectPolicy(dto);
  }

  // Autra-AI Agentic Policy Claim Evaluation
  @Post('evaluate-claim')
  evaluateClaim(@Body() dto: EvaluateClaimDto) {
    return this.insuranceService.evaluateClaimWithAutraAI(dto);
  }
}
