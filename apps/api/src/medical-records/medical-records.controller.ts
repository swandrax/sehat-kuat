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
import { MedicalRecordsService } from './medical-records.service';
import {
  CreateMedicalRecordDto,
  UpdateMedicalRecordDto,
} from './dto/medical-record.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

@Controller('api/v1/medical-records')
@UseGuards(AuthGuard, RolesGuard)
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Get()
  @Roles('ADMIN', 'STAFF', 'DOCTOR', 'PATIENT')
  findAll(@Query() pagination: PaginationDto, @Request() req: any) {
    return this.medicalRecordsService.findAll(pagination, req.user);
  }

  @Get(':id')
  @Roles('ADMIN', 'STAFF', 'DOCTOR', 'PATIENT')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.medicalRecordsService.findOne(id, req.user);
  }

  @Post()
  @Roles('ADMIN', 'DOCTOR')
  create(@Body() dto: CreateMedicalRecordDto, @Request() req: any) {
    return this.medicalRecordsService.create(dto, req.user);
  }

  @Patch(':id')
  @Roles('ADMIN', 'DOCTOR')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMedicalRecordDto,
    @Request() req: any,
  ) {
    return this.medicalRecordsService.update(id, dto, req.user);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.medicalRecordsService.remove(id);
  }
}
