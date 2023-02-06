import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SetEnvAsString } from '@Src/utils/env-variable.util';

export interface JwtPayload {
  id: string;
}

export interface JwtTokensPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Tokens service
 */
@Injectable()
export class TokensService {
  @SetEnvAsString('JWT_ACCESS_SECRET')
  private readonly accessTokenSecret: string;

  @SetEnvAsString('JWT_REFRESH_SECRET')
  private readonly refreshTokenSecret: string;

  @SetEnvAsString('JWT_ACCESS_EXPIRES_IN')
  private readonly accessTokenExpiresIn: string;

  @SetEnvAsString('JWT_REFRESH_EXPIRES_IN')
  private readonly refreshTokenExpiresIn: string;

  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: this.accessTokenSecret,
      expiresIn: this.accessTokenExpiresIn,
    });
  }

  async generateRefreshToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: this.refreshTokenSecret,
      expiresIn: this.refreshTokenExpiresIn,
    });
  }

  async generatePairTokens(payload: JwtPayload) {
    return {
      accessToken: await this.generateAccessToken(payload),
      refreshToken: await this.generateRefreshToken(payload),
    };
  }

  async verifyRefreshToken(token: string) {
    return this.jwtService.verify(token, {
      secret: this.refreshTokenSecret,
    });
  }
}
