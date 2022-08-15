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
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
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
  getCurrentUserTransactions(@AuthUser() user: User): Promise<Transaction[]> {
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
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionsService.createTransaction(
      user,
      createTransactionDto,
    );
  }

  @Patch(':transactionId')
  updateTransaction(
    @AuthUser() user: User,
    @Param('transactionId') transactionId: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    if (user.role === UserRoles.ADMIN) {
      return this.transactionsService.updateTransaction(
        transactionId,
        updateTransactionDto,
      );
    } else {
      return this.transactionsService.updateTransaction(
        transactionId,
        updateTransactionDto,
        user,
      );
    }
  }

  @Delete(':transactionId')
  deleteTransaction(
    @Param('transactionId') transactionId: number,
  ): Promise<null> {
    return this.transactionsService.deleteTransactionById(transactionId);
  }
}
