import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { BalanceService } from './balance.service';
import { AuthGuard } from '@nestjs/passport';
// создаём интерфейс с user
interface AuthRequest extends Request {
  user: { id: string };
}

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getBalance(
    @Req() req: AuthRequest, // <-- используем AuthRequest
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    const userId = req.user.id;
    return this.balanceService.getBalanceByMonth(
      userId,
      parseInt(year),
      parseInt(month),
    );
  }
}
