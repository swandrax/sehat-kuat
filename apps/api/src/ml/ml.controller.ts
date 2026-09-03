import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { MLService } from './ml.service';
import { ClassifySymptomDto, PredictHealthRiskDto } from './dto/ml.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

@Controller('api/v1/ml')
export class MLController {
  constructor(private readonly mlService: MLService) {}

  @Get('metrics')
  getMetrics() {
    return this.mlService.getMetrics();
  }

  @Post('classify-symptom')
  classifySymptom(@Body() dto: ClassifySymptomDto) {
    return this.mlService.classifySymptom(dto);
  }

  @Post('predict-risk')
  predictHealthRisk(@Body() dto: PredictHealthRiskDto) {
    return this.mlService.predictHealthRisk(dto);
  }

  @Post('train')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  triggerTraining() {
    return this.mlService.triggerTraining();
  }
}
