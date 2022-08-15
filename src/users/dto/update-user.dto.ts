import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { UserRoles } from '../user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'username must be a string' })
  @Length(4, 50, {
    message: 'username length must be in between 4 and 50 symbols',
  })
  readonly username?: string;

  @IsOptional()
  @IsString({ message: 'displayName must be a string' })
  @Length(4, 50, {
    message: 'displayName length must be in between 4 and 50 symbols',
  })
  readonly displayName?: string;

  @IsOptional()
  @IsEnum(UserRoles, {
    message: `Role must be one of: ${Object.values(UserRoles).join(', ')}`,
  })
  readonly role?: UserRoles;

  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @Length(4, 30, {
    message: 'Password length must be in between 4 and 30 symbols',
  })
  readonly password?: string;
}
