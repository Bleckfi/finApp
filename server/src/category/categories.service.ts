import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

// Заменяем импорт enum на объявление типа
type CategoryType = 'income' | 'expense';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async getAll(userId: string) {
    return this.prisma.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
  }

  async add(userId: string, name: string, type: CategoryType) {
    return this.prisma.category.create({
      data: { name, type, userId },
    });
  }

  async delete(userId: string, id: string) {
    return this.prisma.category.deleteMany({
      where: { id, userId },
    });
  }
}
