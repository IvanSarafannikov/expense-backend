import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import type { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { refreshTokenCookieOptios } from './tokens.settings';

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
  async refresh(@Req() request: Request): Promise<{ refreshToken: string }> {
    const refreshToken = await this.auhtService.refresh(
      request.cookies['refreshToken'],
    );
    return { refreshToken };
  }

  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<null> {
    await this.auhtService.logout(request.cookies['refreshToken']);

    response.clearCookie('refreshToken', refreshTokenCookieOptios);

    return null;
  }
}
