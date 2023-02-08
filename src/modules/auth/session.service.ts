import { Injectable, NotFoundException } from '@nestjs/common';
import Prisma from '@prisma/client';

import { PrismaService } from '@Shared/modules/prisma/prisma.service';


@Injectable()
export class SessionService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async create(data: Prisma.Prisma.SessionCreateArgs) {
    return this.prismaService.session.create(data);
  }

  async delete(data: Prisma.Prisma.SessionDeleteArgs) {
    return this.prismaService.session.delete(data);
  }

  async deleteMany(data: Prisma.Prisma.SessionDeleteManyArgs) {
    return this.prismaService.session.deleteMany(data);
  }

  async findMany(data: Prisma.Prisma.SessionFindManyArgs) {
    return this.prismaService.session.findMany(data);
  }

  async findFirst(data: Prisma.Prisma.SessionFindFirstArgs) {
    return this.prismaService.session.findFirst(data);
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
    return this.prismaService.session.update(data);
  }
}
