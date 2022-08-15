import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { refreshTokenOptions, refreshTokenPayload } from '../tokens.settings';

import { UsersService } from 'src/users/users.service';
import type { User } from 'src/users/user.entity';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const refreshToken = request.cookies['refreshToken'];

          if (!refreshToken) {
            return null;
          }
          return refreshToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: refreshTokenOptions.secret,
    });
  }

  async validate(payload: refreshTokenPayload): Promise<User> {
    if (!payload) {
      throw new UnauthorizedException(
        'Your refresh token is invalid or has expired',
      );
    }

    const user = await this.usersService.getUserById(payload.id);

    if (!user) {
      throw new UnauthorizedException('Your refresh token is invalid');
    }

    return user;
  }
}
