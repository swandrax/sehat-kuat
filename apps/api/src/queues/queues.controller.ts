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
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { QueuesService } from './queues.service';
import { CreateQueueDto, UpdateQueueDto } from './dto/queue.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { AppEventsService } from '../common/events/events.service';
import { Observable } from 'rxjs';

@Controller('api/v1/queues')
export class QueuesController {
  constructor(
    private readonly queuesService: QueuesService,
    private readonly events: AppEventsService,
  ) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF', 'DOCTOR', 'PATIENT')
  findAll(@Query() pagination: PaginationDto, @Request() req: any) {
    return this.queuesService.findAll(pagination, req.user);
  }

  // SSE Stream for real-time queue changes
  @Sse('stream/:doctorId')
  streamQueues(@Param('doctorId') doctorId: string): Observable<MessageEvent> {
    return this.events.getQueueStream(doctorId);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF', 'DOCTOR', 'PATIENT')
  findOne(@Param('id') id: string) {
    return this.queuesService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF', 'PATIENT')
  create(@Body() dto: CreateQueueDto) {
    return this.queuesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF', 'DOCTOR')
  update(@Param('id') id: string, @Body() dto: UpdateQueueDto) {
    return this.queuesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  remove(@Param('id') id: string) {
    return this.queuesService.remove(id);
  }
}
