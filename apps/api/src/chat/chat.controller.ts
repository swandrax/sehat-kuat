import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatSessionDto, CreateChatMessageDto } from './dto/chat.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('api/v1/chat/sessions')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  getSessions(@Request() req: any) {
    return this.chatService.getSessions(req.user.sub);
  }

  @Get(':id')
  getSession(@Param('id') id: string, @Request() req: any) {
    return this.chatService.getSession(id, req.user.sub);
  }

  @Post()
  createSession(@Request() req: any, @Body() dto: CreateChatSessionDto) {
    return this.chatService.createSession(req.user.sub, dto);
  }

  @Post(':id/messages')
  addMessage(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: CreateChatMessageDto,
  ) {
    return this.chatService.addMessage(id, req.user.sub, dto);
  }

  @Delete(':id')
  deleteSession(@Param('id') id: string, @Request() req: any) {
    return this.chatService.deleteSession(id, req.user.sub);
  }
}
