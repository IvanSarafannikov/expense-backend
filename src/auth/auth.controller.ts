import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import type { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { refreshTokenCookieOptios } from './tokens.settings';
import { AuthUser } from './decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly auhtService: AuthService) {}

  @Post('register')
  register(@Body() userDto: User): Promise<{
    user: User;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    return this.auhtService.register(userDto);
  }

  @Post('login')
  async login(
    @Body() candidate: { username: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ): Promise<{
    user: User;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    const responseData = await this.auhtService.login(candidate);

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
    const accessToken = this.auhtService.generateAccessToken(user);
    return { accessToken };
  }

  @Post('logout')
  @UseGuards(RefreshAuthGuard)
  async logout(
    @AuthUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ): Promise<null> {
    await this.auhtService.logout(user);

    response.clearCookie('refreshToken', refreshTokenCookieOptios);

    return null;
  }
}
