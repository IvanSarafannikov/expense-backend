import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionsRepository.find();
  }

  async getTransactionById(id: number): Promise<Transaction | null> {
    return this.transactionsRepository.findOne({ where: { id } });
  }

  async createTransaction(transactionData: Transaction): Promise<Transaction> {
    // TODO: implement create-transaction dto on which create transaction for validation
    const transaction = this.transactionsRepository.create(transactionData);
    return this.transactionsRepository.save(transaction);
  }

  async updateTransaction(
    id: number,
    transactionDataToUpdate: Transaction,
  ): Promise<Transaction> {
    // TODO: create update-transaction dto and update entity with it to prevent updating unwanted fields and validation

    const transaction = await this.transactionsRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new BadRequestException(
        'Transaction you want to update does not exists',
      );
    }

    return this.transactionsRepository.save({
      ...transaction,
      ...transactionDataToUpdate,
    });
  }

  async deleteTransactionById(id: number): Promise<null> {
    const result = await this.transactionsRepository.delete({ id });

    if (!result.affected) {
      throw new BadRequestException('User you want to delete does not exists');
    }

    return null;
  }
}
