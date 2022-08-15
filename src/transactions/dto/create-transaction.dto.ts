import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString, Length } from 'class-validator';

export class CreateTransactionDto {
  @IsString({ message: 'label must be a string' })
  @Length(2, 50, {
    message: 'label length must be in between 2 and 50 symbols',
  })
  label!: string;

  @Type(() => Date)
  @IsDate({ message: 'date must be a date in format YYYY-MM-DD' })
  date!: Date;

  @IsNumber({}, { message: 'amount must be a number' })
  amount!: number;

  @IsString({ message: 'categoryLabel must be a string' })
  categoryLabel!: string;
}
