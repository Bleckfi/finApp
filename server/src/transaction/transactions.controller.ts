import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from '../type/express';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Get()
  getAll(@Req() req) {
    return this.transactionsService.getAll(req.user.id);
  }

  @Post()
  async createTransaction(@Req() req: RequestWithUser, @Body() dto) {
    const userId = req.user.id; // получаем ID пользователя из JWT
    return this.transactionsService.createTransaction(dto, userId);
  }
  @Get('latest')
  async getLatest(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.transactionsService.getLatestTransactions(userId, 5);
  }

  @Delete(':id')
  async deleteTransaction(@Param('id') id: string, @Req() req) {
    const userId = req.user.id; // получаем id пользователя из запроса
    return this.transactionsService.deleteTransaction(id, userId);
  }
}
