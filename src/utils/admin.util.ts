import { PrismaClient } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';

export async function createAdmin() {
  const prisma = new PrismaClient();

  const adminCandidate = await prisma.user.findFirst({
    where: {
      role: 'admin',
    },
  });

  if (!adminCandidate) {
    await prisma.user.create({
      data: {
        role: 'admin',
        email: 'admin@gmail.com',
        username: 'Admin',
        password: bcryptjs.hashSync('1234', +process.env.PASSWORD_SALT),
      },
    });
  }
}
