import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

@Controller('api/v1/payments')
@UseGuards(AuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @Roles('ADMIN', 'STAFF', 'PATIENT')
  findAll(@Query() pagination: PaginationDto, @Request() req: any) {
    return this.paymentsService.findAll(pagination, req.user);
  }

  @Get(':id')
  @Roles('ADMIN', 'STAFF', 'PATIENT')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.paymentsService.findOne(id, req.user);
  }

  @Post()
  @Roles('ADMIN', 'STAFF', 'PATIENT')
  create(@Body() dto: CreatePaymentDto, @Request() req: any) {
    return this.paymentsService.create(dto, req.user);
  }

  @Patch(':id')
  @Roles('ADMIN', 'STAFF')
  update(@Param('id') id: string, @Body() dto: UpdatePaymentDto, @Request() req: any) {
    return this.paymentsService.update(id, dto, req.user);
  }
}
