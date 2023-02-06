import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import Prisma from '@prisma/client';

export class CreateExpenseCategoryDto {
  @ApiProperty({
    description: 'Expense category label',
    example: 'Food',
    type: 'string',
    minLength: 1,
    maxLength: 30,
  })
  @MinLength(1)
  @MaxLength(30)
  @IsString()
  readonly label: string;
}

export class UpdateExpenseCategoryDto {
  @ApiProperty({
    description: 'Expense category label',
    example: 'Food',
    type: 'string',
    minLength: 1,
    maxLength: 30,
  })
  @MinLength(1)
  @MaxLength(30)
  @IsString()
  readonly label: string;
}

export class ExpenseCategoryDto implements Prisma.ExpenseCategory {
  @ApiProperty({
    description: 'Expense category ID',
    example: '90ab52ed-0212-4910-9c49-346a50adc5be',
    type: 'string',
  })
  readonly id: string;

  @ApiProperty({
    description: 'Expense category label',
    example: 'Food',
    type: 'string',
  })
  readonly label: string;

  @ApiProperty({
    description: 'User ID',
    example: '83313f3f-10dc-4d93-a15c-bc71fd3727fe',
    type: 'string',
  })
  readonly userId: string;

  @ApiProperty({
    description: 'Create date',
    example: '2023-02-06T08:53:39.850Z',
    type: 'string',
  })
  readonly createdAt: Date;

  @ApiProperty({
    description: 'Update date',
    example: '2023-02-06T08:53:39.850Z',
    type: 'string',
  })
  readonly updatedAt: Date;
}

export class CreateTransactionDto
  implements Pick<Prisma.Transaction, 'label' | 'expenseCategoryId' | 'amount'>
{
  @ApiProperty({
    description: 'Transaction date, by default `now`',
    example: '2023-02-03T17:09:38.384Z',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({
    description: 'Expense category ID',
    example: 'fb3db38e-0c04-463f-a27b-77127790bdca',
    type: 'string',
  })
  @IsUUID()
  readonly expenseCategoryId: string;

  @ApiProperty({
    description: 'Transaction label',
    example: 'MacBook Air 2022',
    type: 'string',
    minLength: 1,
    maxLength: 30,
  })
  @MinLength(1)
  @MaxLength(30)
  @IsString()
  readonly label: string;

  @ApiProperty({
    description: 'Transactions amount',
    example: 100,
    type: 'number',
  })
  @IsNumber()
  readonly amount: number;
}

export class TransactionDto {
  @ApiProperty({
    description: 'Transaction ID',
    type: 'string',
  })
  readonly id: string;

  @ApiProperty({
    description: 'Transaction label',
    example: 'Milk',
    type: 'string',
  })
  readonly label: string;

  @ApiProperty({
    description: 'Transactions amount',
    example: 100,
    type: 'number',
  })
  readonly amount: number;

  @ApiProperty({
    description: 'User ID',
    example: '48222f72-a8bd-4b7c-9b42-5d9a17db6e0b',
    type: 'string',
  })
  readonly userId: string;

  @ApiProperty({
    description: 'Expense category ID',
    example: 'ad9e0898-a5fb-11ed-afa1-0242ac120002',
    type: 'string',
  })
  readonly expenseCategoryId: string;

  @ApiProperty({
    description: 'Create date',
    example: '2023-02-06T08:53:39.850Z',
    type: 'string',
  })
  readonly createdAt: Date;

  @ApiProperty({
    description: 'Update date',
    example: '2023-02-06T08:53:39.850Z',
    type: 'string',
  })
  readonly updatedAt: Date;
}

export class UpdateTransactionDto
  implements
    Partial<Pick<Prisma.Transaction, 'label' | 'expenseCategoryId' | 'amount'>>
{
  @ApiProperty({
    description: 'Transaction date, by default `now`',
    example: '2023-02-03T17:09:38.384Z',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  readonly date?: string;

  @ApiProperty({
    description: 'Expense category ID',
    example: 'ad9e0898-a5fb-11ed-afa1-0242ac120002',
    type: 'string',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  readonly expenseCategoryId?: string;

  @ApiProperty({
    description: 'Transaction label',
    example: 'Milk',
    type: 'string',
    minLength: 1,
    maxLength: 30,
    required: false,
  })
  @MinLength(1)
  @MaxLength(30)
  @IsString()
  @IsOptional()
  readonly label?: string;

  @ApiProperty({
    description: 'Transactions amount',
    example: 100,
    type: 'number',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  readonly amount?: number;
}

export class BallanceDto {
  @ApiProperty({
    description: 'Ballance',
    example: 1500,
    type: 'number',
  })
  readonly ballance: number;
}
