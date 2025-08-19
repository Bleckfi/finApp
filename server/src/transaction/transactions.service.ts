import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async getAll(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: 'desc' },
    });
  }
  async createTransaction(dto, userId: string) {
    return this.prisma.transaction.create({
      data: {
        amount: dto.amount,
        date: dto.date ? new Date(dto.date) : new Date(),
        userId,
        categoryId: dto.categoryId,
      },
    });
  }
  async getLatestTransactions(userId: string, limit: number) {
    return this.prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: 'desc' },
      take: limit,
    });
  }

  async deleteTransaction(id: string, userId: string) {
    const tx = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!tx || tx.userId !== userId) {
      throw new NotFoundException('Transaction not found');
    }

    return this.prisma.transaction.delete({
      where: { id },
    });
  }
}
