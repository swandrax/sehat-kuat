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
import { NotificationsService } from './notifications.service';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from './dto/notification.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AppEventsService } from '../common/events/events.service';
import { Observable } from 'rxjs';

@Controller('api/v1/notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly events: AppEventsService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query() pagination: PaginationDto, @Request() req: any) {
    return this.notificationsService.findAll(pagination, req.user);
  }

  // SSE Stream for real-time user notification feed
  @Sse('stream/:userId')
  streamNotifications(@Param('userId') userId: string): Observable<MessageEvent> {
    return this.events.getNotificationStream(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(dto);
  }

  @Patch('read-all')
  @UseGuards(AuthGuard)
  markAllAsRead(@Request() req: any) {
    return this.notificationsService.markAllAsRead(req.user.sub);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateNotificationDto) {
    return this.notificationsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }
}
