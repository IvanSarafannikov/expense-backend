import { prisma } from '@Src/shared/prisma';

export async function clearDatabase() {
  await prisma.transaction.deleteMany();
  await prisma.expenseCategory.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
}
