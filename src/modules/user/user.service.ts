import { BadRequestException, Injectable } from '@nestjs/common';
import Prisma from '@prisma/client';

import { prisma } from '@Src/shared/prisma';

@Injectable()
export class UserService {
  constructor() { }

  async create(data: Prisma.Prisma.UserCreateArgs) {
    return prisma.user.create(data);
  }

  async findFirst(data: Prisma.Prisma.UserFindFirstArgs) {
    return prisma.user.findFirst(data);
  }

  async findMany(data: Prisma.Prisma.UserFindManyArgs) {
    return prisma.user.findMany(data);
  }

  async getExists(
    data: Prisma.Prisma.UserFindFirstArgs,
    callback?: () => never,
  ) {
    const userCandidate = await this.findFirst(data);

    if (!userCandidate) {
      if (callback) {
        callback();
      }

      throw new BadRequestException('User not exists');
    }

    return userCandidate;
  }

  async update(data: Prisma.Prisma.UserUpdateArgs) {
    return prisma.user.update(data);
  }
}
