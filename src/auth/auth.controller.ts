import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import type { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { refreshTokenCookieOptios } from './tokens.settings';
import { AuthUser } from './decorators/user.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto): Promise<{
    user: User;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(
    @Body() candidate: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{
    user: User;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    const responseData = await this.authService.login(candidate);

    response.cookie(
      'refreshToken',
      responseData.tokens.refreshToken,
      refreshTokenCookieOptios,
    );
    return responseData;
  }

  @Get('refresh')
  @UseGuards(RefreshAuthGuard)
  refresh(@AuthUser() user: User): { accessToken: string } {
    const accessToken = this.authService.generateAccessToken(user);
    return { accessToken };
  }

  @Post('logout')
  @UseGuards(RefreshAuthGuard)
  async logout(
    @AuthUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ): Promise<null> {
    await this.authService.logout(user);

    response.clearCookie('refreshToken', refreshTokenCookieOptios);

    return null;
  }
}
