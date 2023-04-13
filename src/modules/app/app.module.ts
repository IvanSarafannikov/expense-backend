import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envsConfig } from 'src/general/configs/envs.config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envsConfig.postgres_host,
      port: Number(envsConfig.postgres_port),
      username: envsConfig.postgres_user,
      password: envsConfig.postgres_password,
      database: envsConfig.postgres_name,
      entities: [],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
