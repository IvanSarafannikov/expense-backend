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
import type { CreateTransactionDto } from './dto/create-transaction.dto';
import type { UpdateTransactionDto } from './dto/update-transaction.dto';
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
    return this.transactionsRepository.find({
      where: { user },
    });
  }

  async getTransactionById(id: number): Promise<Transaction | null> {
    return this.transactionsRepository.findOne({
      where: { id },
    });
  }

  async getUserTransactionById(
    user: User,
    id: number,
  ): Promise<Transaction | null> {
    return this.transactionsRepository.findOne({ where: { user, id } });
  }

  async createTransaction(
    user: User,
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const category = await this.categoriesService.getUserCategoryByLabel(
      user,
      createTransactionDto.categoryLabel,
    );

    if (!category) {
      throw new BadRequestException(
        'Category you want to create transaction for does not exists',
      );
    }

    const transaction =
      this.transactionsRepository.create(createTransactionDto);

    transaction.user = user;
    transaction.category = category;

    return this.transactionsRepository.save(transaction);
  }

  async updateTransaction(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
    user?: User,
  ): Promise<Transaction> {
    const transaction = user
      ? await this.getUserTransactionById(user, id)
      : await this.getTransactionById(id);

    if (!transaction) {
      throw new BadRequestException(
        'Transaction you want to update does not exists',
      );
    }

    return this.transactionsRepository.save({
      ...transaction,
      ...updateTransactionDto,
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
