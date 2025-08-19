import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '@nestjs/passport';

type CategoryType = 'income' | 'expense';

@Controller('categories')
@UseGuards(AuthGuard('jwt'))
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  getAll(@Req() req) {
    return this.categoriesService.getAll(req.user.id);
  }

  @Post()
  add(@Req() req, @Body() body: { name: string; type: CategoryType }) {
    return this.categoriesService.add(req.user.id, body.name, body.type);
  }

  @Delete(':id')
  delete(@Req() req, @Param('id') id: string) {
    return this.categoriesService.delete(req.user.id, id);
  }
}
