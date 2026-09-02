import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

@Controller('api/v1/appointments')
@UseGuards(AuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @Roles('ADMIN', 'STAFF', 'DOCTOR', 'PATIENT')
  findAll(@Query() pagination: PaginationDto, @Request() req: any) {
    return this.appointmentsService.findAll(pagination, req.user);
  }

  @Get(':id')
  @Roles('ADMIN', 'STAFF', 'DOCTOR', 'PATIENT')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'STAFF', 'PATIENT')
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(dto);
  }

  @Patch(':id')
  @Roles('ADMIN', 'STAFF', 'DOCTOR', 'PATIENT')
  update(@Param('id') id: string, @Body() dto: UpdateAppointmentDto) {
    return this.appointmentsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'STAFF')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}
