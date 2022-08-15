import { IsString, Length } from 'class-validator';

export class LoginUserDto {
  @IsString({ message: 'username must be a string' })
  @Length(4, 50, {
    message: 'username length must be in between 4 and 50 symbols',
  })
  readonly username!: string;

  @IsString({ message: 'Password must be a string' })
  @Length(4, 30, {
    message: 'Password length must be in between 4 and 30 symbols',
  })
  readonly password!: string;
}
