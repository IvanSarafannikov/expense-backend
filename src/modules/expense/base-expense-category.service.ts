import { Injectable, NotFoundException } from '@nestjs/common';
import Prisma from '@prisma/client';

import { prisma } from '@Src/shared/prisma';

@Injectable()
export class BaseExpenseCategoryService {
  constructor() {}

  async getExisting(
    data: Prisma.Prisma.BaseExpenseCategoryFindFirstArgs,
    callback?: () => never,
  ) {
    const candidate = await this.findFirst(data);

    if (!candidate) {
      if (callback) {
        callback();
      }

      throw new NotFoundException('Base expense category does not exists');
    }

    return candidate;
  }

  async findFirst(data: Prisma.Prisma.BaseExpenseCategoryFindFirstArgs) {
    return prisma.baseExpenseCategory.findFirst(data);
  }

  async findMany(data: Prisma.Prisma.BaseExpenseCategoryFindManyArgs) {
    return prisma.baseExpenseCategory.findMany(data);
  }

  async create(data: Prisma.Prisma.BaseExpenseCategoryCreateArgs) {
    return prisma.baseExpenseCategory.create(data);
  }

  async update(data: Prisma.Prisma.BaseExpenseCategoryUpdateArgs) {
    return prisma.baseExpenseCategory.update(data);
  }

  async delete(data: Prisma.Prisma.BaseExpenseCategoryDeleteArgs) {
    return prisma.baseExpenseCategory.delete(data);
  }

  async generateBaseCategoriesForUser(userId: string) {
    const baseLabels = await prisma.baseExpenseCategory.findMany();

    const labels = baseLabels.map(({ label }) => ({
      label,
      userId,
    }));

    await prisma.expenseCategory.createMany({
      data: labels,
      skipDuplicates: true,
    });
  }
}
