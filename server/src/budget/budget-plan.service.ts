// src/budget/budget-plan.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Decimal } from '@prisma/client/runtime/client';

@Injectable()
export class BudgetPlanService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.budgetPlan.findMany({ where: { userId } });
  }

  async create(data: { name: string; target: number; userId: string }) {
    return this.prisma.budgetPlan.create({
      data: {
        name: data.name,
        target: data.target,
        user: {
          connect: { id: data.userId }, // подключаем существующего пользователя
        },
      },
    });
  }

  async addAmount(id: string, amount: number) {
    const goal = await this.prisma.budgetPlan.findUnique({ where: { id } });
    if (!goal) throw new Error('Goal not found');

    // Складываем с Decimal
    const newCurrent = new Decimal(goal.current).add(amount);

    return this.prisma.budgetPlan.update({
      where: { id },
      data: { current: newCurrent },
    });
  }

  async delete(id: string) {
    return this.prisma.budgetPlan.delete({ where: { id } });
  }
}
