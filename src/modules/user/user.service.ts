import { Injectable, NotFoundException } from '@nestjs/common';
import Prisma from '@prisma/client';

import { PrismaService } from '@Shared/modules/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async create(data: Prisma.Prisma.UserCreateArgs) {
    return this.prismaService.user.create(data);
  }

  async findFirst(data: Prisma.Prisma.UserFindFirstArgs) {
    return this.prismaService.user.findFirst(data);
  }

  async findMany(data: Prisma.Prisma.UserFindManyArgs) {
    return this.prismaService.user.findMany(data);
  }

  async getExisting(
    data: Prisma.Prisma.UserFindFirstArgs,
    callback?: () => never,
  ) {
    const userCandidate = await this.findFirst(data);

    if (!userCandidate) {
      if (callback) {
        callback();
      }

      throw new NotFoundException('User does not exists');
    }

    return userCandidate;
  }

  async update(data: Prisma.Prisma.UserUpdateArgs) {
    return this.prismaService.user.update(data);
  }
}
