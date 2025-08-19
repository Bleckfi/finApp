import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BalanceService {
  constructor(private readonly prisma: PrismaService) {}

  async getBalanceByMonth(userId: string, year: number, month: number) {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const incomeSum = await this.prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        date: { gte: startOfMonth, lte: endOfMonth },
        category: { type: 'income' }, // предполагаем, что у категории есть поле type
      },
    });

    const expenseSum = await this.prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        date: { gte: startOfMonth, lte: endOfMonth },
        category: { type: 'expense' },
      },
    });

    return {
      income: incomeSum._sum.amount ?? 0,
      expense: expenseSum._sum.amount ?? 0,
    };
  }
}
