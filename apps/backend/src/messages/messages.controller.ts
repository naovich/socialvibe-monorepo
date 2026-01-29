import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('conversations')
  getConversations(@Request() req) {
    return this.messagesService.getConversations(req.user.id);
  }

  @Get('conversation/:recipientId')
  getOrCreateConversation(@Request() req, @Param('recipientId') recipientId: string) {
    return this.messagesService.getOrCreateConversation(req.user.id, recipientId);
  }

  @Get(':conversationId')
  getMessages(@Request() req, @Param('conversationId') conversationId: string) {
    return this.messagesService.getMessages(conversationId, req.user.id);
  }

  @Post(':conversationId')
  sendMessage(
    @Request() req,
    @Param('conversationId') conversationId: string,
    @Body('text') text: string,
  ) {
    return this.messagesService.sendMessage(req.user.id, conversationId, text);
  }

  @Delete('message/:messageId')
  deleteMessage(@Request() req, @Param('messageId') messageId: string) {
    return this.messagesService.deleteMessage(req.user.id, messageId);
  }
}
