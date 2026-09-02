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
import { PrescriptionsService } from './prescriptions.service';
import {
  CreatePrescriptionDto,
  UpdatePrescriptionDto,
} from './dto/prescription.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

@Controller('api/v1/prescriptions')
@UseGuards(AuthGuard, RolesGuard)
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Get()
  @Roles('ADMIN', 'STAFF', 'DOCTOR', 'PATIENT')
  findAll(@Query() pagination: PaginationDto, @Request() req: any) {
    return this.prescriptionsService.findAll(pagination, req.user);
  }

  @Get(':id')
  @Roles('ADMIN', 'STAFF', 'DOCTOR', 'PATIENT')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.prescriptionsService.findOne(id, req.user);
  }

  @Post()
  @Roles('ADMIN', 'DOCTOR')
  create(@Body() dto: CreatePrescriptionDto, @Request() req: any) {
    return this.prescriptionsService.create(dto, req.user);
  }

  @Patch(':id')
  @Roles('ADMIN', 'DOCTOR', 'STAFF')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePrescriptionDto,
    @Request() req: any,
  ) {
    return this.prescriptionsService.update(id, dto, req.user);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.prescriptionsService.remove(id);
  }
}
