import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'josh',
    minLength: 4,
    maxLength: 20,
  })
  @MinLength(4)
  @MaxLength(20)
  @IsString()
  readonly username: string;

  @ApiProperty({
    description: "New user'email",
    example: 'john@mail.com',
    minLength: 5,
    maxLength: 320,
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'User password',
    example: 'Ci18&hl1',
    minLength: 4,
    maxLength: 20,
  })
  @MinLength(4)
  @MaxLength(20)
  @IsString()
  readonly password: string;
}

export class LogInDto {
  @ApiProperty({
    description: "New user'email",
    example: 'john@mail.com',
    minLength: 5,
    maxLength: 320,
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'User password',
    example: 'Ci18&hl1',
    minLength: 4,
    maxLength: 20,
  })
  @MinLength(4)
  @MaxLength(20)
  @IsString()
  readonly password: string;
}

export class LogInResponseDto {
  @ApiProperty({
    description: 'Access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  @IsString()
  accessToken: string;
}

export class RefreshDto extends LogInResponseDto {}

export class UpdateSessionDto {
  @ApiProperty({
    description: 'User device name',
    example: 'MacBook Pro',
    minLength: 4,
    maxLength: 20,
  })
  @MinLength(4)
  @MaxLength(20)
  @IsString()
  readonly deviceName: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    description: "Old user's password",
    example: 'Ci18&hl1',
    minLength: 4,
    maxLength: 20,
  })
  @MinLength(4)
  @MaxLength(20)
  @IsString()
  readonly oldPassword: string;

  @ApiProperty({
    description: 'New password',
    example: 'cja8*ia&',
    minLength: 4,
    maxLength: 20,
  })
  @MinLength(4)
  @MaxLength(20)
  @IsString()
  readonly newPassword: string;
}

export class SessionsDto {
  @ApiProperty({
    description: 'Session ID',
    example: 'fb3db38e-0c04-463f-a27b-77127790bdca',
  })
  @IsString()
  readonly id: string;

  @ApiProperty({
    description: 'Session name',
    example: 'MacBook Pro',
  })
  @IsString()
  readonly deviceName: string;

  @ApiProperty({
    description: 'Session creation date',
    example: '2023-02-03T09:16:27.977Z',
  })
  @IsString()
  readonly createdAt: Date;

  @ApiProperty({
    description: 'Session refresh date',
    example: '2023-02-03T09:16:27.977Z',
  })
  @IsString()
  readonly updatedAt: Date;
}
