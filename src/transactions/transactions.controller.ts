import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import type { Transaction } from './transaction.entity';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  getUsers() {
    return this.transactionsService.getAllTransactions();
  }

  @Get(':transactionId')
  getUser(@Param('transactionId') transactionId: number) {
    return this.transactionsService.getTransactionById(transactionId);
  }

  @Post()
  createUser(@Body() transaction: Transaction) {
    return this.transactionsService.createTransaction(transaction);
  }

  @Patch(':transactionId')
  updateUser(
    @Param('transactionId') transactionId: number,
    @Body() transactionDataToUpdate: Transaction,
  ) {
    return this.transactionsService.updateTransaction(
      transactionId,
      transactionDataToUpdate,
    );
  }

  @Delete(':transactionId')
  deleteUser(@Param('transactionId') transactionId: number) {
    return this.transactionsService.deleteTransactionById(transactionId);
  }
}
