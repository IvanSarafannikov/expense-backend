import { IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'label must be a string' })
  @Length(2, 50, {
    message: 'label length must be in between 2 and 50 symbols',
  })
  label!: string;
}
