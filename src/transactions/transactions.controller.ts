import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthUser } from 'src/auth/decorators/user.decorator';
import { AccessAuthGuard } from 'src/auth/guards/access-auth.guard';
import type { User } from 'src/users/user.entity';
import type { Transaction } from './transaction.entity';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  getUsers(): Promise<Transaction[]> {
    return this.transactionsService.getAllTransactions();
  }

  @Get(':transactionId')
  getUser(
    @Param('transactionId') transactionId: number,
  ): Promise<Transaction | null> {
    return this.transactionsService.getTransactionById(transactionId);
  }

  @Post()
  @UseGuards(AccessAuthGuard)
  createUser(
    @AuthUser() user: User,
    @Body()
    transactionData: {
      transaction: Transaction;
      categoryLabel: string;
    },
  ): Promise<Transaction> {
    return this.transactionsService.createTransaction(user, transactionData);
  }

  @Patch(':transactionId')
  updateUser(
    @Param('transactionId') transactionId: number,
    @Body() transactionDataToUpdate: Transaction,
  ): Promise<Transaction> {
    return this.transactionsService.updateTransaction(
      transactionId,
      transactionDataToUpdate,
    );
  }

  @Delete(':transactionId')
  deleteUser(@Param('transactionId') transactionId: number): Promise<null> {
    return this.transactionsService.deleteTransactionById(transactionId);
  }
}
