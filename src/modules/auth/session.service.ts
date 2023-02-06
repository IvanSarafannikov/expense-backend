import { Injectable, NotFoundException } from '@nestjs/common';
import Prisma from '@prisma/client';

import { prisma } from '@Src/shared/prisma';

@Injectable()
export class SessionService {
  constructor() {}

  async create(data: Prisma.Prisma.SessionCreateArgs) {
    return await prisma.session.create(data);
  }

  async delete(data: Prisma.Prisma.SessionDeleteArgs) {
    return await prisma.session.delete(data);
  }

  async deleteMany(data: Prisma.Prisma.SessionDeleteManyArgs) {
    return await prisma.session.deleteMany(data);
  }

  async findMany(data: Prisma.Prisma.SessionFindManyArgs) {
    return await prisma.session.findMany(data);
  }

  async findFirst(data: Prisma.Prisma.SessionFindFirstArgs) {
    return await prisma.session.findFirst(data);
  }

  async getExisting(
    data: Prisma.Prisma.SessionFindFirstArgs,
    callback?: () => never,
  ) {
    const sessionCandidate = await this.findFirst(data);

    if (!sessionCandidate) {
      if (callback) {
        callback();
      }

      throw new NotFoundException('Session does not exists');
    }

    return sessionCandidate;
  }

  async updateExisting(
    data: Prisma.Prisma.SessionUpdateArgs,
    callback?: () => never,
  ) {
    const sessionCandidate = await this.findFirst({
      where: data.where,
    });

    if (!sessionCandidate) {
      if (callback) {
        callback();
      }

      throw new NotFoundException('Session does not exists');
    }

    return await this.update(data);
  }

  async update(data: Prisma.Prisma.SessionUpdateArgs) {
    return await prisma.session.update(data);
  }
}
