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
import type { CreateCategoryDto } from './dto/create-category.dto';
import type { UpdateCategoryDto } from './dto/update-category.dto';

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

  async createCategory(
    user: User,
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const existingCategory = await this.getUserCategoryByLabel(
      user,
      createCategoryDto.label,
    );

    if (existingCategory) {
      throw new ConflictException('Category with this label already exists');
    }

    const category = this.categoriesRepository.create(createCategoryDto);
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
    updateCategoryDto: UpdateCategoryDto,
    user?: User,
  ): Promise<Category> {
    const category = user
      ? await this.getUserCategoryById(user, id)
      : await this.getCategoryById(id);

    if (!category) {
      throw new BadRequestException(
        'Category you want to update does not exists',
      );
    }

    if (category.label === 'Other') {
      throw new BadRequestException(
        'You are not allowed to rename this category',
      );
    }

    return this.categoriesRepository.save({
      ...category,
      ...updateCategoryDto,
    });
  }

  async deleteCategoryById(id: number, user?: User): Promise<null> {
    const category = user
      ? await this.getUserCategoryById(user, id)
      : await this.getCategoryById(id);

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
