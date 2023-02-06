import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { JwtProtectedRequest } from '@Module/auth/interfaces/protected-request.interface';
import { JwtAuthGuard } from '@Module/auth/jwt-auth.guard';
import {
  BallanceDto,
  CreateExpenseCategoryDto,
  CreateTransactionDto,
  ExpenseCategoryDto,
  TransactionDto,
  UpdateExpenseCategoryDto,
  UpdateTransactionDto,
} from '@Module/expense/dto/expense-category.dto';
import { ExpenseService } from '@Module/expense/expense.service';

@ApiTags('Expenses')
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) { }

  @ApiOperation({ description: 'Create transaction' })
  @ApiCreatedResponse({
    description: 'Transaction created successfully',
    type: TransactionDto,
  })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @Post('transaction')
  async createTransaction(
    @Req() req: JwtProtectedRequest,
    @Body() body: CreateTransactionDto,
  ) {
    return this.expenseService.createTransaction(req.user.id, body);
  }

  @ApiOperation({ description: 'Get user transactions' })
  @ApiOkResponse({
    description: 'Transactions received successfully',
    type: [TransactionDto],
  })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @Get('transaction')
  async getTransactions(@Req() req: JwtProtectedRequest) {
    return this.expenseService.getTransactions(req.user.id);
  }

  @ApiParam({
    name: 'id',
    description: 'Transaction ID to update',
    type: 'string',
    example: '0f34aaaa-8194-4c90-902c-1155163cac76',
  })
  @ApiOkResponse({
    description: 'Transactions updated successfully',
    type: [TransactionDto],
  })
  @ApiNotFoundResponse({ description: 'Expense category does not exists' })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @Patch('transaction/:id')
  async updateTransaction(
    @Req() req: JwtProtectedRequest,
    @Param('id') id: string,
    @Body() body: UpdateTransactionDto,
  ) {
    return this.expenseService.updateTransaction(req.user.id, id, body);
  }

  @ApiOperation({ description: 'Delete transaction' })
  @ApiParam({
    name: 'id',
    description: 'Transaction ID to delete',
    type: 'string',
    example: '0f34aaaa-8194-4c90-902c-1155163cac76',
  })
  @ApiOkResponse({ description: 'Transaction deleted successfully' })
  @ApiNotFoundResponse({ description: 'Transaction does not exists' })
  @ApiBadRequestResponse({ description: 'This transaction not belongs to you' })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @Delete('transaction/:id')
  async deleteTransaction(
    @Req() req: JwtProtectedRequest,
    @Param('id') id: string,
  ) {
    await this.expenseService.deleteTransaction(req.user.id, id);
  }

  @ApiOperation({ description: 'Create expense category' })
  @ApiCreatedResponse({
    description: 'Expense category created successfully',
    type: ExpenseCategoryDto,
  })
  @ApiBadRequestResponse({
    description: 'Expense category with this label already exists',
  })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @Post('category')
  async createCategory(
    @Req() req: JwtProtectedRequest,
    @Body() body: CreateExpenseCategoryDto,
  ) {
    return this.expenseService.createExpenseCategory(req.user.id, body);
  }

  @ApiOperation({ description: 'Get own expense categories' })
  @ApiOkResponse({
    description: 'Expense categories received successfully',
    type: [ExpenseCategoryDto],
  })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @Get('category')
  async getCategories(@Req() req: JwtProtectedRequest) {
    return this.expenseService.getExpenseCategories(req.user.id);
  }

  @ApiOperation({ description: 'Update expense category' })
  @ApiOkResponse({
    description: 'Expense category updates successfully',
    type: ExpenseCategoryDto,
  })
  @ApiNotFoundResponse({ description: 'Expense category does not exists' })
  @ApiBadRequestResponse({ description: 'This category not belongs to you' })
  @ApiParam({
    name: 'id',
    description: 'Expense category ID to update',
    type: 'string',
    example: '7b6df12f-296e-4297-ba27-9f269dac8bdf',
  })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @Patch('category/:id')
  async updateCategory(
    @Req() req: JwtProtectedRequest,
    @Body() body: UpdateExpenseCategoryDto,
    @Param('id') id: string,
  ) {
    return this.expenseService.updateExpenseCategory(req.user.id, id, body);
  }

  @ApiOperation({ description: 'Delete expense category' })
  @ApiParam({
    name: 'id',
    description: 'Expense category ID to delete',
    type: 'string',
    example: '7b6df12f-296e-4297-ba27-9f269dac8bdf',
  })
  @ApiOkResponse({ description: 'Expense category deleted successfully' })
  @ApiNotFoundResponse({ description: 'Expense category does not exists' })
  @ApiBadRequestResponse({ description: 'This category not belongs to you' })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @Delete('category/:id')
  async deleteCategory(
    @Req() req: JwtProtectedRequest,
    @Param('id') id: string,
  ) {
    await this.expenseService.deleteExpenseCategory(req.user.id, id);
  }

  @ApiOperation({ description: 'Create base expense category' })
  @ApiCreatedResponse({
    description: 'Base category created successfully',
    type: ExpenseCategoryDto,
  })
  @ApiBadRequestResponse({
    description:
      'User is not admin / Expense category with this label already exists',
  })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @Post('base-category')
  async createBaseCategory(
    @Req() req: JwtProtectedRequest,
    @Body() body: CreateExpenseCategoryDto,
  ) {
    return this.expenseService.createBaseExpenseCategory(req.user.id, body);
  }

  @ApiOperation({ description: 'Get base expense category' })
  @ApiOkResponse({
    description: 'Base expense categories received successfully',
    type: [ExpenseCategoryDto],
  })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @Get('base-category')
  async getBaseCategories() {
    return this.expenseService.getBaseCategories();
  }

  @ApiOperation({ description: 'Update base expense category' })
  @ApiParam({
    name: 'id',
    description: 'Expense category ID to update',
    type: 'string',
    example: '7b6df12f-296e-4297-ba27-9f269dac8bdf',
  })
  @ApiOkResponse({
    description: 'Base expense category updated successfully',
    type: ExpenseCategoryDto,
  })
  @ApiBadRequestResponse({
    description:
      'User is not admin / Expense category with this label already exists',
  })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @Patch('base-category/:id')
  async updateBaseCategory(
    @Req() req: JwtProtectedRequest,
    @Param('id') id: string,
    @Body() body: UpdateExpenseCategoryDto,
  ) {
    return this.expenseService.updateBaseCategory(req.user.id, id, body);
  }

  @ApiOperation({ description: 'Delete base expense category' })
  @ApiParam({
    name: 'id',
    description: 'Expense category ID to delete',
    type: 'string',
    example: '7b6df12f-296e-4297-ba27-9f269dac8bdf',
  })
  @ApiOkResponse({
    description: 'Base expense category deleted successfully',
    type: ExpenseCategoryDto,
  })
  @ApiBadRequestResponse({
    description:
      'User is not admin / Expense category with this label already exists',
  })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @Delete('base-category/:id')
  async deleteBaseCategory(
    @Req() req: JwtProtectedRequest,
    @Param('id') id: string,
  ) {
    await this.expenseService.deleteBaseCategory(req.user.id, id);
  }

  @ApiOperation({ description: 'Get current ballance' })
  @ApiOkResponse({
    description: 'Ballance received successfully',
    type: BallanceDto,
  })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @Get('ballance')
  async getBallance(@Req() req: JwtProtectedRequest) {
    const ballance = await this.expenseService.getBallance(req.user.id);

    return {
      ballance,
    };
  }
}
