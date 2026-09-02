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
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto, UpdateDoctorDto } from './dto/doctor.dto';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/schedule.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

@Controller('api/v1')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get('doctors')
  findAll(@Query() pagination: PaginationDto) {
    return this.doctorsService.findAll(pagination);
  }

  @Get('doctors/profile')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR')
  getMyProfile(@Request() req: any) {
    return this.doctorsService.getDoctorByUserId(req.user.sub);
  }

  @Get('doctors/:id')
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(id);
  }

  @Post('doctors')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() dto: CreateDoctorDto) {
    return this.doctorsService.create(dto);
  }

  @Patch('doctors/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'DOCTOR')
  update(@Param('id') id: string, @Body() dto: UpdateDoctorDto) {
    return this.doctorsService.update(id, dto);
  }

  @Delete('doctors/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.doctorsService.remove(id);
  }

  // --- Schedule Endpoints ---

  @Get('doctors/:id/schedules')
  getSchedules(@Param('id') doctorId: string) {
    return this.doctorsService.getSchedules(doctorId);
  }

  @Post('doctors/:id/schedules')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'DOCTOR')
  createSchedule(
    @Param('id') doctorId: string,
    @Body() dto: CreateScheduleDto,
  ) {
    return this.doctorsService.createSchedule(doctorId, dto);
  }

  @Patch('schedules/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'DOCTOR')
  updateSchedule(
    @Param('id') scheduleId: string,
    @Body() dto: UpdateScheduleDto,
  ) {
    return this.doctorsService.updateSchedule(scheduleId, dto);
  }

  @Delete('schedules/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'DOCTOR')
  deleteSchedule(@Param('id') scheduleId: string) {
    return this.doctorsService.deleteSchedule(scheduleId);
  }
}
