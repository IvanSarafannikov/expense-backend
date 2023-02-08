import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Prisma from '@prisma/client';

import { BaseExpenseCategoryService } from '@Module/expense/base-expense-category.service';
import { PrismaService } from '@Shared/modules/prisma/prisma.service';

@Injectable()
export class ExpenseCategoryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly baseExpenseCategoryService: BaseExpenseCategoryService,
  ) { }

  async getExisting(
    data: Prisma.Prisma.ExpenseCategoryFindFirstArgs,
    callback?: () => never,
  ) {
    const candidate = await this.findFirst(data);

    if (!candidate) {
      if (callback) {
        callback();
      }

      throw new NotFoundException('Expense category does not exists');
    }

    return candidate;
  }

  async findFirst(data: Prisma.Prisma.ExpenseCategoryFindFirstArgs) {
    return this.prismaService.expenseCategory.findFirst(data);
  }

  async findMany(data: Prisma.Prisma.ExpenseCategoryFindManyArgs) {
    return this.prismaService.expenseCategory.findMany(data);
  }

  async create(data: Prisma.Prisma.ExpenseCategoryCreateArgs) {
    return this.prismaService.expenseCategory.create(data);
  }

  async update(data: Prisma.Prisma.ExpenseCategoryUpdateArgs) {
    return this.prismaService.expenseCategory.update(data);
  }

  async delete(data: Prisma.Prisma.ExpenseCategoryDeleteArgs) {
    return this.prismaService.expenseCategory.delete(data);
  }

  async generateBaseCategoriesForUser(userId: string) {
    const baseLabels = await this.baseExpenseCategoryService.findMany({});

    const labels = baseLabels.map(({ label }) => ({
      label,
      userId,
    }));

    await this.prismaService.expenseCategory.createMany({

      data: labels,
      skipDuplicates: true,
    });
  }

  checkIfCategoryBelongsToUser(
    user: Prisma.User,
    expenseCategory: Prisma.ExpenseCategory,
    callback?: () => never,
  ) {
    if (user.id !== expenseCategory.userId) {
      if (callback) {
        callback();
      }

      throw new BadRequestException('This category not belongs to you');
    }
  }
}
