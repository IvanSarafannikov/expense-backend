import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import type { User } from 'src/users/user.entity';
import type { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @Inject(forwardRef(() => CategoriesService))
    private readonly categoriesService: CategoriesService,
  ) {}

  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionsRepository.find();
  }

  async getUserTransactions(user: User): Promise<Transaction[]> {
    return this.transactionsRepository.find({ where: { user } });
  }

  async getTransactionById(id: number): Promise<Transaction | null> {
    return this.transactionsRepository.findOne({ where: { id } });
  }

  async getUserTransactionById(
    user: User,
    id: number,
  ): Promise<Transaction | null> {
    return this.transactionsRepository.findOne({ where: { user, id } });
  }

  async createTransaction(
    user: User,
    transactionData: {
      transaction: Transaction;
      categoryLabel: string;
    },
  ): Promise<Transaction> {
    // TODO: implement create-transaction dto on which create transaction for validation

    const category = await this.categoriesService.getUserCategoryByLabel(
      user,
      transactionData.categoryLabel,
    );

    if (!category) {
      throw new BadRequestException(
        'Category you want to create transaction for does not exists',
      );
    }

    const transaction = this.transactionsRepository.create(
      transactionData.transaction,
    );

    transaction.category = category;

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
