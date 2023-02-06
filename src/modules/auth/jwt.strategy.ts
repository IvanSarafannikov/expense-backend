import { getEnv } from '@Src/utils/env-variable.util';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getEnv.string('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: any) {
    return { id: payload.id };
  }
}
