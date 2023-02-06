import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import Prisma from '@prisma/client';
import * as cookieParser from 'cookie-parser';
import type { Application } from 'express';

import { AppModule } from '@Src/app.module';
import { createAdmin } from '@Src/utils/admin.util';
import { createBaseExpenseCategories } from '@Src/utils/base-expense-categories.util';
import { clearDatabase } from '@Test/utils/clear-database';
import { UserActions } from '@Test/utils/user-actions';

describe('AppController (e2e)', () => {
  let app: Application;
  let application: INestApplication;

  beforeAll(async () => {
    // Init express application
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    application = await module
      .createNestApplication()
      .use(cookieParser())
      .useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
      .init();

    app = application.getHttpServer();

    await clearDatabase();

    await createBaseExpenseCategories();
    await createAdmin();
  });

  afterAll(async () => {
    await application.close();
    await clearDatabase();
  });

  it('check if expense categories are created after user registration', async () => {
    expect(await prisma.baseExpenseCategory.findMany()).toHaveLength(7);
  });

  describe('Entire auth logic cycle', () => {
    let user: UserActions;

    it('check if expense categories are created after user registration', async () => {
      expect(await prisma.expenseCategory.findMany()).toHaveLength(0);

      user = new UserActions(app);

      await user.register();

      expect(await prisma.expenseCategory.findMany()).toHaveLength(7);
    });

    let expenseCategory: Prisma.ExpenseCategory;

    it('create new expense category', async () => {
      const { body } = await user.request({
        url: '/expense/category',
        method: 'post',
        send: {
          label: 'NewLabel',
        },
        expect: 201,
      });

      expenseCategory = await prisma.expenseCategory.findFirst({
        where: {
          label: body.label,
        },
      });

      expect(expenseCategory.label).toBeDefined();
    });

    it('update expense category', async () => {
      const { body } = await user.request({
        url: '/expense/category/' + expenseCategory.id,
        method: 'patch',
        send: {
          label: 'NewLabel2',
        },
        expect: 200,
      });

      const categoryFromDb = await prisma.expenseCategory.findFirst({
        where: {
          id: expenseCategory.id,
        },
      });

      expect(body.label).toBe('NewLabel2');
      expect(categoryFromDb.label).toBe('NewLabel2');
    });

    it('delete expense category', async () => {
      const { body } = await user.request({
        url: '/expense/category',
        method: 'post',
        send: {
          label: 'NewLabel12',
        },
        expect: 201,
      });

      await user.request({
        url: '/expense/category/' + body.id,
        method: 'delete',
        expect: 200,
      });

      expect(
        await prisma.expenseCategory.findFirst({ where: { id: body.id } }),
      ).toBeNull();
    });

    it('fetch expense categories', async () => {
      const { body } = await user.request({
        url: '/expense/category',
        method: 'get',
        expect: 200,
      });

      expect(body).toHaveLength(8);
    });

    let admin: UserActions;
    let baseExpenseCategory: Prisma.BaseExpenseCategory;
    let baseExpenseCategories: Prisma.BaseExpenseCategory[];

    it('fetch base expense categories', async () => {
      const { body } = await user.request({
        url: '/expense/base-category',
        method: 'get',
        expect: 200,
      });

      expect(body).toHaveLength(7);
    });

    it('create new base expense category', async () => {
      admin = new UserActions(app, {
        email: 'admin@gmail.com',
        username: 'Admin',
        password: '1234',
      });

      await admin.logIn();

      const { body } = await admin.request({
        url: '/expense/base-category',
        method: 'post',
        send: {
          label: 'SomeThing',
        },
        expect: 201,
      });

      baseExpenseCategory = await prisma.baseExpenseCategory.findFirst({
        where: {
          label: 'SomeThing',
        },
      });

      expect(body.label).toBe('SomeThing');
      expect(baseExpenseCategory).not.toBeNull();
    });

    it('update base expense category', async () => {
      const { body } = await admin.request({
        url: '/expense/base-category/' + baseExpenseCategory.id,
        method: 'patch',
        send: {
          label: 'SomeThingNew',
        },
        expect: 200,
      });

      const updatedBaseCategory = await prisma.baseExpenseCategory.findFirst({
        where: {
          id: baseExpenseCategory.id,
        },
      });

      expect(body.label).toBe('SomeThingNew');
      expect(updatedBaseCategory.label).toBe('SomeThingNew');
    });

    it('delete base expense category', async () => {
      const { body } = await admin.request({
        url: '/expense/base-category/' + baseExpenseCategory.id,
        method: 'delete',
        expect: 200,
      });

      const updatedBaseCategory = await prisma.baseExpenseCategory.findFirst({
        where: {
          id: baseExpenseCategory.id,
        },
      });

      expect(updatedBaseCategory).toBeUndefined;
    });

    it('create transaction', async () => {
      baseExpenseCategories = await prisma.expenseCategory.findMany({
        where: {
          userId: user.user.id,
        },
      });

      const date = new Date();

      const { body } = await user.request({
        url: '/expense/transaction',
        method: 'post',
        send: {
          label: 'Milk',
          amount: 50,
          date,
          expenseCategoryId: baseExpenseCategories.find(
            (category) => category.label === 'Food',
          ).id,
        },
        expect: 201,
      });

      expect(body).toBeDefined();

      const transactionFromDb = await prisma.transaction.findFirst({
        where: {
          id: body.id,
        },
      });

      expect(transactionFromDb).toBeDefined();
      expect(transactionFromDb.label).toBe('Milk');
      expect(transactionFromDb.amount).toBe(50);
      expect(transactionFromDb.date).toBeDefined();
      expect(transactionFromDb.expenseCategoryId).toBeDefined();
    });

    it('fetch user transactions', async () => {
      const { body } = await user.request({
        url: '/expense/transaction',
        method: 'get',
        expect: 200,
      });

      expect(body).toHaveLength(1);
    });

    it('update transaction', async () => {
      const { body: transaction } = await user.request({
        url: '/expense/transaction',
        method: 'get',
      });

      const { body } = await user.request({
        url: '/expense/transaction/' + transaction[0].id,
        method: 'patch',
        send: {
          amount: 100,
        },
        expect: 200,
      });

      expect(body.amount).toBe(100);

      const transactionFromDb = await prisma.transaction.findFirst({
        where: {
          id: body.id,
        },
      });

      expect(transactionFromDb.amount).toBe(100);
    });

    it('delete transaction', async () => {
      const { body: transaction } = await user.request({
        url: '/expense/transaction',
        method: 'get',
      });

      expect(transaction).toHaveLength(1);

      const { body } = await user.request({
        url: '/expense/transaction/' + transaction[0].id,
        method: 'delete',
        expect: 200,
      });

      const { body: transactionAfter } = await user.request({
        url: '/expense/transaction',
        method: 'get',
      });

      expect(transactionAfter).toHaveLength(0);
    });

    it("check behavior of transaction when delete it's expense category", async () => {
      // Create expense category
      const { body: expenseCategory } = await user.request({
        url: '/expense/category',
        method: 'post',
        send: {
          label: 'LabelToDelete',
        },
        expect: 201,
      });

      // Create transactions
      const labels = ['Meal', 'Soda', 'Napkin'];

      for (let i = 0; i < labels.length; i++) {
        await user.request({
          url: '/expense/transaction',
          method: 'post',
          send: {
            label: labels[i],
            amount: 50,
            expenseCategoryId: expenseCategory.id,
          },
          expect: 201,
        });
      }

      const transactionBefore = await prisma.transaction.findMany({
        where: {
          userId: user.user.id,
        },
      });

      // Delete expense category
      await user.request({
        url: '/expense/category/' + expenseCategory.id,
        method: 'delete',
        expect: 200,
      });

      // Check transactions
      const { body: transactions } = await user.request({
        url: '/expense/transaction',
        method: 'get',
        expect: 200,
      });

      const otherExpenseCategory = await prisma.expenseCategory.findFirst({
        where: {
          userId: user.user.id,
          label: 'Other',
        },
      });

      for (let i = 0; i < transactionBefore.length; i++) {
        expect(transactionBefore[i].expenseCategoryId).not.toBe(
          otherExpenseCategory.id,
        );
      }

      const transactionAfter = await prisma.transaction.findMany({
        where: {
          userId: user.user.id,
        },
      });

      for (let i = 0; i < transactionAfter.length; i++) {
        expect(transactionAfter[i].expenseCategoryId).toBe(
          otherExpenseCategory.id,
        );
      }
    });

    it('get ballance', async () => {
      const { body } = await user.request({
        url: '/expense/ballance',
        method: 'get',
        expect: 200,
      });

      const transactions = await prisma.transaction.findMany({
        where: {
          userId: user.user.id,
        },
        select: {
          amount: true,
        },
      });

      let ballance = 0;

      for (let i = 0; i < transactions.length; i++) {
        ballance += transactions[i].amount;
      }

      expect(body.ballance).toBe(ballance);
    });
  });
});
