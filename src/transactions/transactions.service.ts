import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async getAllTransactions() {
    return this.transactionsRepository.find();
  }

  async getTransactionById(id: number) {
    return this.transactionsRepository.findOne({ where: { id } });
  }

  async createTransaction(transactionData: Transaction) {
    // TODO: implement create-transaction dto on which create transaction for validation
    const transaction = this.transactionsRepository.create(transactionData);
    return this.transactionsRepository.save(transaction);
  }

  async updateTransaction(id: number, transactionDataToUpdate: Transaction) {
    // TODO: create update-transaction dto and update entity with it to prevent updating unwanted fields and validation

    const transaction = await this.transactionsRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new HttpException(
        'Transaction you want to update does not exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.transactionsRepository.save({
      ...transaction,
      ...transactionDataToUpdate,
    });
  }

  async deleteTransactionById(id: number) {
    const result = await this.transactionsRepository.delete({ id });

    if (!result.affected) {
      throw new HttpException(
        'User you want to delete does not exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    return null;
  }
}
