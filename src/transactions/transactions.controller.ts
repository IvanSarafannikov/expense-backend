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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthUser } from 'src/auth/decorators/user.decorator';
import { AccessAuthGuard } from 'src/auth/guards/access-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { User, UserRoles } from 'src/users/user.entity';
import type { Transaction } from './transaction.entity';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
@UseGuards(AccessAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN)
  getAllTransactions(): Promise<Transaction[]> {
    return this.transactionsService.getAllTransactions();
  }

  @Get()
  getCurrentUserTransactions(
    @AuthUser() user: User,
  ): Promise<Transaction[] | null> {
    return this.transactionsService.getUserTransactions(user);
  }

  @Get(':transactionId')
  getTransaction(
    @AuthUser() user: User,
    @Param('transactionId') transactionId: number,
  ): Promise<Transaction | null> {
    if (user.role) {
      return this.transactionsService.getTransactionById(transactionId);
    } else {
      return this.transactionsService.getUserTransactionById(
        user,
        transactionId,
      );
    }
  }

  // TODO: allow admins to create transactions for other users

  @Post()
  @UseGuards(AccessAuthGuard)
  createCurrentUserTransaction(
    @AuthUser() user: User,
    @Body()
    transactionData: {
      transaction: Transaction;
      categoryLabel: string;
    },
  ): Promise<Transaction> {
    return this.transactionsService.createTransaction(user, transactionData);
  }

  // TODO: allow users to update only theirs transactions and allow admins to update any user transaction

  @Patch(':transactionId')
  updateTransaction(
    @Param('transactionId') transactionId: number,
    @Body() transactionDataToUpdate: Transaction,
  ): Promise<Transaction> {
    return this.transactionsService.updateTransaction(
      transactionId,
      transactionDataToUpdate,
    );
  }

  @Delete(':transactionId')
  deleteTransaction(
    @Param('transactionId') transactionId: number,
  ): Promise<null> {
    return this.transactionsService.deleteTransactionById(transactionId);
  }
}
