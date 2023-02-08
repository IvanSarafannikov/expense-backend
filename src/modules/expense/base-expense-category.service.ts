import { Injectable, NotFoundException } from '@nestjs/common';
import Prisma from '@prisma/client';

import { PrismaService } from '@Shared/modules/prisma/prisma.service';

@Injectable()
export class BaseExpenseCategoryService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

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
    return this.prismaService.baseExpenseCategory.findFirst(data);
  }

  async findMany(data: Prisma.Prisma.BaseExpenseCategoryFindManyArgs) {
    return this.prismaService.baseExpenseCategory.findMany(data);
  }

  async create(data: Prisma.Prisma.BaseExpenseCategoryCreateArgs) {
    return this.prismaService.baseExpenseCategory.create(data);
  }

  async update(data: Prisma.Prisma.BaseExpenseCategoryUpdateArgs) {
    return this.prismaService.baseExpenseCategory.update(data);
  }

  async delete(data: Prisma.Prisma.BaseExpenseCategoryDeleteArgs) {
    return this.prismaService.baseExpenseCategory.delete(data);
  }

  async generateBaseCategoriesForUser(userId: string) {
    const baseLabels = await this.prismaService.baseExpenseCategory.findMany();

    const labels = baseLabels.map(({ label }) => ({
      label,
      userId,
    }));

    await this.prismaService.expenseCategory.createMany({
      data: labels,
      skipDuplicates: true,
    });
  }
}
