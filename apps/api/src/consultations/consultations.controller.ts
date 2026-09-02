import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { CompleteConsultationDto } from './dto/consultation.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

@Controller('api/v1/consultations')
@UseGuards(AuthGuard, RolesGuard)
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post(':appointmentId/start')
  @Roles('DOCTOR')
  startConsultation(
    @Param('appointmentId') appointmentId: string,
    @Request() req: any,
  ) {
    return this.consultationsService.startConsultation(appointmentId, req.user.sub);
  }

  @Post('complete')
  @Roles('DOCTOR')
  completeConsultation(
    @Body() dto: CompleteConsultationDto,
    @Request() req: any,
  ) {
    return this.consultationsService.completeConsultation(dto, req.user.sub);
  }
}
