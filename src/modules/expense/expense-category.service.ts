import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Prisma from '@prisma/client';

import { BaseExpenseCategoryService } from '@Module/expense/base-expense-category.service';
import { prisma } from '@Src/shared/prisma';

@Injectable()
export class ExpenseCategoryService {
  constructor(
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
    return prisma.expenseCategory.findFirst(data);
  }

  async findMany(data: Prisma.Prisma.ExpenseCategoryFindManyArgs) {
    return prisma.expenseCategory.findMany(data);
  }

  async create(data: Prisma.Prisma.ExpenseCategoryCreateArgs) {
    return prisma.expenseCategory.create(data);
  }

  async update(data: Prisma.Prisma.ExpenseCategoryUpdateArgs) {
    return prisma.expenseCategory.update(data);
  }

  async delete(data: Prisma.Prisma.ExpenseCategoryDeleteArgs) {
    return prisma.expenseCategory.delete(data);
  }

  async generateBaseCategoriesForUser(userId: string) {
    const baseLabels = await this.baseExpenseCategoryService.findMany({});

    const labels = baseLabels.map(({ label }) => ({
      label,
      userId,
    }));

    await prisma.expenseCategory.createMany({
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
