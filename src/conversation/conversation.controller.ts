import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Controller('conversations')
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @Post()
  create(@Body() dto: CreateConversationDto) {
    return this.conversationService.createConversation(dto);
  }

  @Get(':userId')
  getUserConversations(@Param('userId') userId: string) {
    return this.conversationService.getUserConversations(userId);
  }
}
