import { config } from 'dotenv';
config();

export const envsConfig = {
  port: process.env['PORT'] || 5000,
  access_secret_key: process.env['ACCESS_SECRET_KEY'],
  refresh_secret_key: process.env['REFRESH_SECRET_KEY'],
  postgres_port: process.env['POSTGRES_PORT'],
  postgres_host: process.env['POSTGRES_HOST'],
  postgres_name: process.env['POSTGRES_NAME'],
  postgres_user: process.env['POSTGRES_USER'],
  postgres_password: process.env['POSTGRES_PASSWORD'],
};
