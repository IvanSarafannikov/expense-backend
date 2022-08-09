import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async getAllCategories() {
    return this.categoriesRepository.find();
  }

  async getCategoryById(id: number) {
    return this.categoriesRepository.findOne({ where: { id } });
  }

  async createCategory(categoryData: Category) {
    // TODO: create-category dto to create entity with validation
    const category = this.categoriesRepository.create(categoryData);
    return this.categoriesRepository.save(category);
  }

  async updateCategory(id: number, categoryDataToUpdate: Category) {
    // TODO: create update-category dto and update entity with it to prevent updating unwanted fields and validation

    const category = await this.categoriesRepository.findOne({ where: { id } });

    if (!category) {
      throw new HttpException(
        'User you want to update does not exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.categoriesRepository.save({
      ...category,
      ...categoryDataToUpdate,
    });
  }

  async deleteCategoryById(id: number) {
    // TODO: delete related entities
    const result = await this.categoriesRepository.delete({ id });

    if (!result.affected) {
      throw new HttpException(
        'User you want to delete does not exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    return null;
  }
}
