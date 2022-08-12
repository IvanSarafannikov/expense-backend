import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { User } from 'src/users/user.entity';
import type { Repository } from 'typeorm';
import { Category } from './category.entity';
import { defaultCategories } from './default.categories';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async getAllCategories(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  async getCategoryById(id: number): Promise<Category | null> {
    return this.categoriesRepository.findOne({
      where: { id },
      relations: { transactions: true, user: true },
    });
  }

  async getUserCategories(user: User): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: { user },
      relations: { transactions: true },
    });
  }

  async getUserCategoryById(user: User, id: number): Promise<Category | null> {
    return this.categoriesRepository.findOne({
      where: { user, id },
      relations: { transactions: true },
    });
  }

  async getUserCategoryByLabel(
    user: User,
    label: string,
  ): Promise<Category | null> {
    return this.categoriesRepository.findOne({
      where: { user, label },
      relations: { transactions: true },
    });
  }

  async getUserOtherCategory(user: User): Promise<Category | null> {
    return this.categoriesRepository.findOne({
      where: { user, label: 'Other' },
      relations: { transactions: true },
    });
  }

  async createCategory(user: User, categoryData: Category): Promise<Category> {
    // TODO: create-category dto to create entity with validation
    const existingCategory = await this.getUserCategoryByLabel(
      user,
      categoryData.label,
    );

    if (existingCategory) {
      throw new ConflictException('Category with this label already exists');
    }

    const category = this.categoriesRepository.create(categoryData);
    category.user = user;
    return this.categoriesRepository.save(category);
  }

  async createDefaultCategories(user: User): Promise<Category[]> {
    const categories = this.categoriesRepository.create(
      defaultCategories.map((category) => ({ label: category, user })),
    );

    return this.categoriesRepository.save(categories);
  }

  async updateCategory(
    id: number,
    categoryDataToUpdate: Category,
  ): Promise<Category> {
    // TODO: create update-category dto and update entity with it to prevent updating unwanted fields and validation

    const category = await this.categoriesRepository.findOne({ where: { id } });

    if (!category) {
      throw new BadRequestException('User you want to update does not exists');
    }

    if (category.label === 'Other') {
      throw new BadRequestException(
        'You are not allowed to rename this category',
      );
    }

    return this.categoriesRepository.save({
      ...category,
      ...categoryDataToUpdate,
    });
  }

  async deleteCategoryById(id: number): Promise<null> {
    const category = await this.getCategoryById(id);

    if (!category) {
      throw new BadRequestException(
        'Category you want to delete does not exists',
      );
    }

    if (category?.label === 'Other') {
      throw new BadRequestException(
        `You are not allowed to delete this category`,
      );
    }

    const otherCategory = await this.getUserOtherCategory(category.user);

    if (otherCategory) {
      if (otherCategory?.transactions) {
        otherCategory.transactions = [
          ...otherCategory?.transactions,
          ...category.transactions,
        ];
      } else {
        otherCategory.transactions = category.transactions;
      }
      await this.categoriesRepository.save(otherCategory);
    }

    const result = await this.categoriesRepository.delete({ id });

    if (!result.affected) {
      throw new BadRequestException('User you want to delete does not exists');
    }

    return null;
  }
}
