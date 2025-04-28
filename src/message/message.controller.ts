import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { MessageService } from './message.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post()
  sendMessage(@Body() dto: SendMessageDto) {
    return this.messageService.sendMessage(dto);
  }

  @Get(':conversationId')
  getConversationMessages(@Param('conversationId') conversationId: string) {
    return this.messageService.getConversationMessages(conversationId);
  }
}
