import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BudgetPlanService } from './budget-plan.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('budget-plan')
@UseGuards(AuthGuard('jwt')) // <-- здесь используем JWT Guard
export class BudgetPlanController {
  constructor(private readonly service: BudgetPlanService) {}

  @Get()
  findAll(@Req() req) {
    return this.service.findAll(req.user.id); // req.user теперь доступен
  }

  @Post()
  create(@Req() req, @Body() body: { name: string; target: number }) {
    return this.service.create({ ...body, userId: req.user.id });
  }

  @Put(':id/add')
  addAmount(@Param('id') id: string, @Body() body: { amount: number }) {
    return this.service.addAmount(id, body.amount);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
