import type { UserRoles } from 'src/users/user.entity';
import { config } from 'dotenv';

// dotenv.config there because ConfigModule in app loads later than variables in this file being defined
config();

export const accessTokenOptions = {
  expiresIn: '10m',
  secret: process.env?.['ACCES_TOKEN_SECRET_KEY'],
};

export const refreshTokenOptions = {
  expiresIn: '30d',
  secret: process.env?.['REFRESH_TOKEN_SECRET_KEY'],
};

export const refreshTokenCookieOptios = {
  // 30 days
  maxAge: 30 * 24 * 60 * 60 * 1000,
  httpOnly: true,
};

export interface refreshTokenPayload {
  id: number;
  username: string;
  role: UserRoles;
}

export interface accessTokenPayload {
  id: number;
  username: string;
  role: UserRoles;
}
