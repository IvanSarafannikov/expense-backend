import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TransactionsModule } from './transactions/transactions.module';
import { Transaction } from './transactions/transaction.entity';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/category.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env?.['DATABASE_URL'],
      entities: [User, Category, Transaction],
      synchronize: true,
      ssl: true,
      extra: {
        ssl: { rejectUnauthorized: false },
      },
    }),
    UsersModule,
    AuthModule,
    CategoriesModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
