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
import { PatientsService } from './patients.service';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

@Controller('api/v1/patients')
@UseGuards(AuthGuard, RolesGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  @Roles('ADMIN', 'STAFF', 'DOCTOR')
  findAll(@Query() pagination: PaginationDto) {
    return this.patientsService.findAll(pagination);
  }

  @Get('profile')
  @Roles('PATIENT')
  getMyProfile(@Request() req: any) {
    return this.patientsService.getPatientByUserId(req.user.sub);
  }

  @Get(':id')
  @Roles('ADMIN', 'STAFF', 'DOCTOR', 'PATIENT')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.patientsService.findOne(id, req.user);
  }

  @Post()
  @Roles('ADMIN', 'STAFF')
  create(@Body() dto: CreatePatientDto) {
    return this.patientsService.create(dto);
  }

  @Patch(':id')
  @Roles('ADMIN', 'STAFF', 'PATIENT')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePatientDto,
    @Request() req: any,
  ) {
    return this.patientsService.update(id, dto, req.user);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.patientsService.remove(id);
  }
}
