import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/auth/prisma/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  async createConversation(dto: CreateConversationDto) {
    // Check if conversation already exists
    const existing = await this.prisma.conversation.findFirst({
      where: {
        productId: dto.productId,
        buyerId: dto.buyerId,
        merchantId: dto.merchantId,
      },
    });

    if (existing) {
      return existing; // Return existing
    }

    // Create new
    return this.prisma.conversation.create({
      data: {
        productId: dto.productId,
        buyerId: dto.buyerId,
        merchantId: dto.merchantId,
      },
    });
  }

  async getUserConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        OR: [{ buyerId: userId }, { merchantId: userId }],
      },
      include: {
        product: true,
        buyer: true,
        merchant: true,
      },
    });
  }
}
