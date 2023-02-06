import { Request } from 'express';
import Prisma from '@prisma/client';

export interface LocalProtectedRequest extends Request {
  user: Prisma.User;
}

export interface JwtProtectedRequest extends Request {
  user: Pick<Prisma.User, 'id'>;
}
