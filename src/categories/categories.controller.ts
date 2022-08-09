import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import type { Category } from './category.entity';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getCategories(): Promise<Category[]> {
    return this.categoriesService.getAllCategories();
  }

  @Get(':categoryId')
  getCategory(
    @Param('categoryId') categoryId: number,
  ): Promise<Category | null> {
    return this.categoriesService.getCategoryById(categoryId);
  }

  @Post()
  createCategory(@Body() category: Category): Promise<Category> {
    return this.categoriesService.createCategory(category);
  }

  @Patch(':categoryId')
  updateCategory(
    @Param('categoryId') categoryId: number,
    @Body() categoryDataToUpdate: Category,
  ): Promise<Category> {
    return this.categoriesService.updateCategory(
      categoryId,
      categoryDataToUpdate,
    );
  }

  @Delete(':categoryId')
  deleteUser(@Param('categoryId') categoryId: number): Promise<null> {
    return this.categoriesService.deleteCategoryById(categoryId);
  }
}
