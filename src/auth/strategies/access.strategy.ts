import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { accessTokenOptions, accessTokenPayload } from '../tokens.settings';

import { UsersService } from 'src/users/users.service';
import type { User } from 'src/users/user.entity';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: accessTokenOptions.secret,
    });
  }

  async validate(payload: accessTokenPayload): Promise<User> {
    if (!payload) {
      throw new UnauthorizedException(
        'Your access token is invalid or has expired',
      );
    }

    const user = await this.usersService.getUserById(payload.id);

    if (!user) {
      throw new UnauthorizedException('Your refresh token is invalid');
    }

    return user;
  }
}
