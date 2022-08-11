import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Category } from './category.entity';

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
    return this.categoriesRepository.findOne({ where: { id } });
  }

  async createCategory(categoryData: Category): Promise<Category> {
    // TODO: create-category dto to create entity with validation
    const category = this.categoriesRepository.create(categoryData);
    return this.categoriesRepository.save(category);
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

    return this.categoriesRepository.save({
      ...category,
      ...categoryDataToUpdate,
    });
  }

  async deleteCategoryById(id: number): Promise<null> {
    // TODO: delete related entities
    const result = await this.categoriesRepository.delete({ id });

    if (!result.affected) {
      throw new BadRequestException('User you want to delete does not exists');
    }

    return null;
  }
}
