import { PrismaService } from '@Shared/modules/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Prisma from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

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
    return this.prismaService.transaction.findFirst(data);
  }

  async findMany(data: Prisma.Prisma.TransactionFindManyArgs) {
    return this.prismaService.transaction.findMany(data);
  }

  async create(data: Prisma.Prisma.TransactionCreateArgs) {
    return this.prismaService.transaction.create(data);
  }

  async update(data: Prisma.Prisma.TransactionUpdateArgs) {
    return this.prismaService.transaction.update(data);
  }

  async updateMany(data: Prisma.Prisma.TransactionUpdateManyArgs) {
    return this.prismaService.transaction.updateMany(data);
  }

  async delete(data: Prisma.Prisma.TransactionDeleteArgs) {
    return this.prismaService.transaction.delete(data);
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
