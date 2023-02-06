import { PrismaClient } from '@prisma/client';

const baseExpenseCategories = [
  'Other',
  'Clothes',
  'Food',
  'Shopping',
  'Lend',
  'Transport',
  'Health',
];

export async function createBaseExpenseCategories() {
  const prisma = new PrismaClient();

  const baseCategories = await prisma.baseExpenseCategory.findMany();

  // Create base expense categories if no one doesn't exists
  if (!baseCategories.length) {
    const data = baseExpenseCategories.map((label) => ({ label }));

    await prisma.baseExpenseCategory.createMany({
      data,
    });
  }
}
