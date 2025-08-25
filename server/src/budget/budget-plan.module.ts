import { Module } from '@nestjs/common';
import { BudgetPlanController } from './budget-plan.controller';
import { BudgetPlanService } from './budget-plan.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [BudgetPlanController],
  providers: [BudgetPlanService, PrismaService],
})
export class BudgetPlanModule {}
