import { Controller, Get, Post, Put, Delete, Body, Param, Req } from '@nestjs/common';
import { BudgetPlanService } from './budget-plan.service';
import { Prisma } from 'generated/prisma';

@Controller('budget-plan')
export class BudgetPlanController {
    constructor(private readonly service: BudgetPlanService) {}

    @Get()
    findAll(@Req() req) {
        return this.service.findAll(req.user.id);
    }

    @Post()
    create(@Body() body: Prisma.BudgetPlanCreateInput) {
        return this.service.create(body);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() body: Prisma.BudgetPlanUpdateInput) {
        return this.service.update(id, body);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.service.delete(id);
    }
}
