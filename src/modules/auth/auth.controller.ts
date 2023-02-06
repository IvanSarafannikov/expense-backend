import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBasicAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService } from '@Module/auth/auth.service';
import {
  JwtProtectedRequest,
  LocalProtectedRequest,
} from '@Module/auth/interfaces/protected-request.interface';
import { JwtAuthGuard } from '@Module/auth/jwt-auth.guard';
import { JwtTokensPair } from '@Module/auth/tokens.service';
import {
  ChangePasswordDto,
  LogInDto,
  LogInResponseDto,
  RegisterDto,
  SessionsDto,
  UpdateSessionDto,
} from '@Src/modules/auth/dto/auth.dto';
import { DeviceName } from '@Src/utils/device-name.decorator';
import { GetCookies } from '@Src/utils/get-cookies.decorator';

@ApiTags('Authentication / authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ description: 'Register new user' })
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @ApiOperation({ description: 'Log-in user' })
  @ApiResponse({ type: LogInResponseDto })
  @Get('login')
  async logIn(
    @Res() res: Response,
    @Body() body: LogInDto,
    @DeviceName() deviceName: string,
  ) {
    const tokens = await this.authService.logIn(body, deviceName);

    this.setCookies(res, tokens);
  }

  @ApiOperation({ description: 'Log-out user' })
  @Get('logout')
  async logOut(
    @Res() res: Response,
    @GetCookies('refreshToken') refreshToken: string,
  ) {
    await this.authService.logOut(refreshToken);

    res.clearCookie('refreshToken');
    res.sendStatus(200);
  }

  @ApiOperation({ description: 'Refresh tokens' })
  @Get('refresh')
  async refresh(
    @Res() res: Response,
    @GetCookies('refreshToken') refreshToken: string,
  ) {
    const tokens = await this.authService.refresh(refreshToken);

    this.setCookies(res, tokens);
  }

  @ApiOperation({ description: 'Get sessions' })
  @ApiResponse({ type: [SessionsDto] })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @Get('session')
  async getSessions(@Req() req: JwtProtectedRequest) {
    return this.authService.getSessions(req.user.id);
  }

  @ApiOperation({ description: 'Delete session with specified ID' })
  @ApiParam({ name: 'id', type: 'string', example: '0f34aaaa-8194-4c90-902c-1155163c9911' })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @Delete('session/:id')
  async deleteSession(
    @Req() req: JwtProtectedRequest,
    @Param('id', ParseUUIDPipe) sessionId: string,
  ) {
    return this.authService.deleteSessionById(req.user.id, sessionId);
  }

  @ApiOperation({ description: 'Update session name' })
  @ApiParam({ name: 'id', type: 'string', example: '0f34aaaa-8194-4c90-902c-1155163cac76' })
  @ApiResponse({ type: SessionsDto })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @Patch('session/:id')
  async updateSession(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateSessionDto,
  ) {
    return this.authService.updateSession(id, body);
  }

  @ApiOperation({ description: 'Change user password' })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(
    @Req() req: JwtProtectedRequest,
    @Body() body: ChangePasswordDto,
  ) {
    await this.authService.changePassword(req.user.id, body);
  }

  private async setCookies(
    res: Response,
    { accessToken, refreshToken }: JwtTokensPair,
    responseCode = 200,
  ) {
    res.cookie('refreshToken', refreshToken, {
      maxAge: 30 * 24 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: true,
    });

    res.send({ accessToken }).status(responseCode);
  }
}
