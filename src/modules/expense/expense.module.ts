import { Module, forwardRef } from '@nestjs/common';

import { BaseExpenseCategoryService } from '@Module/expense/base-expense-category.service';
import { ExpenseCategoryService } from '@Module/expense/expense-category.service';
import { ExpenseController } from '@Module/expense/expense.controller';
import { ExpenseService } from '@Module/expense/expense.service';
import { TransactionService } from '@Module/expense/transaction.service';
import { UserModule } from '@Module/user/user.module';

@Module({
  providers: [
    ExpenseService,
    ExpenseCategoryService,
    BaseExpenseCategoryService,
    TransactionService,
  ],
  controllers: [ExpenseController],
  imports: [forwardRef(() => UserModule)],
  exports: [
    ExpenseService,
    ExpenseCategoryService,
    BaseExpenseCategoryService,
    TransactionService,
  ],
})
export class ExpenseModule {}
