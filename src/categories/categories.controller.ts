import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { Category } from './category.entity';
import { CategoriesService } from './categories.service';
import { AccessAuthGuard } from 'src/auth/guards/access-auth.guard';
import { AuthUser } from 'src/auth/decorators/user.decorator';
import { User, UserRoles } from 'src/users/user.entity';

@Controller('categories')
@UseGuards(AccessAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getCurrentUserCategories(@AuthUser() user: User): Promise<Category[]> {
    return this.categoriesService.getUserCategories(user);
  }

  @Get(':categoryId')
  getCategory(
    @AuthUser() user: User,
    @Param('categoryId') categoryId: number,
  ): Promise<Category | null> {
    if (user.role === UserRoles.ADMIN) {
      return this.categoriesService.getCategoryById(categoryId);
    } else {
      return this.categoriesService.getUserCategoryById(user, categoryId);
    }
  }

  // TODO: allow admins to create categories for other users
  @Post()
  createCurrentUserCategory(
    @AuthUser() user: User,
    @Body() category: Category,
  ): Promise<Category> {
    return this.categoriesService.createCategory(user, category);
  }

  @Patch(':categoryId')
  updateCategory(
    @AuthUser() user: User,
    @Param('categoryId') categoryId: number,
    @Body() categoryDataToUpdate: Category,
  ): Promise<Category> {
    if (user.role === UserRoles.ADMIN) {
      return this.categoriesService.updateCategory(
        categoryId,
        categoryDataToUpdate,
      );
    } else {
      return this.categoriesService.updateCategory(
        categoryId,
        categoryDataToUpdate,
        user,
      );
    }
  }

  @Delete(':categoryId')
  deleteCategory(
    @AuthUser() user: User,
    @Param('categoryId') categoryId: number,
  ): Promise<null> {
    if (user.role === UserRoles.ADMIN) {
      return this.categoriesService.deleteCategoryById(categoryId);
    } else {
      return this.categoriesService.deleteCategoryById(categoryId, user);
    }
  }
}
