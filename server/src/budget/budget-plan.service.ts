import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { BudgetPlan, Prisma } from '../../generated/prisma';

@Injectable()
export class BudgetPlanService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string): Promise<BudgetPlan[]> {
    return this.prisma.budgetPlan.findMany({
      where: { userId },
      include: { category: true },
    });
  }

  async create(data: Prisma.BudgetPlanCreateInput): Promise<BudgetPlan> {
    return this.prisma.budgetPlan.create({ data });
  }

  async update(
    id: string,
    data: Prisma.BudgetPlanUpdateInput,
  ): Promise<BudgetPlan> {
    return this.prisma.budgetPlan.update({ where: { id }, data });
  }

  async delete(id: string): Promise<BudgetPlan> {
    return this.prisma.budgetPlan.delete({ where: { id } });
  }
}
