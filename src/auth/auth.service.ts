import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import {
  accessTokenOptions,
  accessTokenPayload,
  refreshTokenOptions,
  refreshTokenPayload,
} from './tokens.settings';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async register(userDto: User): Promise<{
    user: User;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    // TODO: create-user dto for validation
    const savedUser = await this.usersService.getUserByUsername(
      userDto.username,
    );

    if (savedUser) {
      throw new ConflictException(
        `username ${userDto.username} is already in use`,
      );
    }

    const user = await this.usersService.createUser(userDto);

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    const userWithRefreshToken = await this.usersService.updateUser(user.id, {
      ...user,
      refreshToken,
    });

    return {
      user: userWithRefreshToken,
      tokens: { accessToken, refreshToken },
    };
  }

  async login(candidate: { username: string; password: string }): Promise<{
    user: User;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    // TODO: dto for validation
    const user = await this.usersService.getUserByUsername(candidate.username);

    // TODO: compare hashed passwords
    if (!user || user.password !== candidate.password) {
      throw new UnauthorizedException('wrong username or password');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    const userWithRefreshToken = await this.usersService.updateUser(user.id, {
      ...user,
      refreshToken,
    });

    return {
      user: userWithRefreshToken,
      tokens: { accessToken, refreshToken },
    };
  }

  async refresh(refreshToken: string): Promise<string> {
    // const
    const payload = this.validateRefreshToken(refreshToken);
    const savedUser = await this.usersService.getUserByRefreshToken(
      refreshToken,
    );

    if (!payload || !savedUser) {
      throw new UnauthorizedException(
        'Your refresh token is invalid or has expired',
      );
    }

    const accessToken = this.generateAccessToken(savedUser);

    return accessToken;
  }

  async logout(refreshToken: string): Promise<null> {
    if (!refreshToken) {
      throw new UnauthorizedException('You are not logged in');
    }
    const payload = this.validateRefreshToken(refreshToken);

    if (!payload) {
      throw new UnauthorizedException(
        'Your refresh token is invalid or has expired',
      );
    }

    await this.usersService.deleteUserRefreshToken(payload.id);

    return null;
  }

  //   private validateAccessToken(accessToken: string): accessTokenPayload | null {
  //     try {
  //       const payload = this.jwtService.verify(accessToken, accessTokenOptions);
  //       return payload;
  //     } catch (e) {
  //       return null;
  //     }
  //   }

  private validateRefreshToken(
    refreshToken: string,
  ): accessTokenPayload | null {
    try {
      const payload = this.jwtService.verify(refreshToken, refreshTokenOptions);
      return payload;
    } catch (e) {
      return null;
    }
  }

  private generateAccessToken(user: User): string {
    const payload: accessTokenPayload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    return this.jwtService.sign(payload, accessTokenOptions);
  }

  private generateRefreshToken(user: User): string {
    const payload: refreshTokenPayload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    return this.jwtService.sign(payload, refreshTokenOptions);
  }
}
