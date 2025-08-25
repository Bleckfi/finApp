import { Module } from '@nestjs/common';
import { AppController } from './user/controller';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma.module';
import { CategoriesModule } from './category/categories.module';
import { TransactionsModule } from './transaction/transactions.module';
import { BalanceModule } from './user/balance.module';
import { BudgetPlanModule } from './budget/budget-plan.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    CategoriesModule,
    TransactionsModule,
    BalanceModule,
    BudgetPlanModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
