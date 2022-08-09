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
  getCategories() {
    return this.categoriesService.getAllCategories();
  }

  @Get(':categoryId')
  getCategory(@Param('categoryId') categoryId: number) {
    return this.categoriesService.getCategoryById(categoryId);
  }

  @Post()
  createCategory(@Body() category: Category) {
    return this.categoriesService.createCategory(category);
  }

  @Patch(':categoryId')
  updateCategory(
    @Param('categoryId') categoryId: number,
    @Body() categoryDataToUpdate: Category,
  ) {
    return this.categoriesService.updateCategory(
      categoryId,
      categoryDataToUpdate,
    );
  }

  @Delete(':categoryId')
  deleteUser(@Param('categoryId') categoryId: number) {
    return this.categoriesService.deleteCategoryById(categoryId);
  }
}
