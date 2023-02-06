import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Prisma from '@prisma/client';

import { prisma } from '@Src/shared/prisma';

@Injectable()
export class TransactionService {
  constructor() {}

  async getExisting(
    data: Prisma.Prisma.TransactionFindFirstArgs,
    callback?: () => never,
  ) {
    const candidate = await this.findFirst(data);

    if (!candidate) {
      if (callback) {
        callback();
      }

      throw new NotFoundException('Transaction does not exists');
    }

    return candidate;
  }

  async findFirst(data: Prisma.Prisma.TransactionFindFirstArgs) {
    return prisma.transaction.findFirst(data);
  }

  async findMany(data: Prisma.Prisma.TransactionFindManyArgs) {
    return prisma.transaction.findMany(data);
  }

  async create(data: Prisma.Prisma.TransactionCreateArgs) {
    return prisma.transaction.create(data);
  }

  async update(data: Prisma.Prisma.TransactionUpdateArgs) {
    return prisma.transaction.update(data);
  }

  async updateMany(data: Prisma.Prisma.TransactionUpdateManyArgs) {
    return prisma.transaction.updateMany(data);
  }

  async delete(data: Prisma.Prisma.TransactionDeleteArgs) {
    return prisma.transaction.delete(data);
  }

  checkIfTransactionBelongsToUser(
    user: Prisma.User,
    transaction: Prisma.Transaction,
    callback?: () => never,
  ) {
    if (user.id !== transaction.userId) {
      if (callback) {
        callback();
      }

      throw new BadRequestException('This transaction not belongs to you');
    }
  }
}
