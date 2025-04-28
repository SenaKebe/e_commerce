import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/auth/prisma/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(dto: SendMessageDto) {
    return this.prisma.message.create({
      data: {
        conversationId: dto.conversationId,
        senderId: dto.senderId,
        content: dto.content,
      },
    });
  }

  async getConversationMessages(conversationId: string) {
    return this.prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        sender: true, // optional: show who sent the message
      },
    });
  }
}
