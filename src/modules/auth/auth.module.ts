import { Module, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '@Src/modules/auth/auth.controller';
import { AuthService } from '@Src/modules/auth/auth.service';
import { SessionService } from '@Src/modules/auth/session.service';
import { JwtStrategy } from '@Module/auth/jwt.strategy';
import { TokensService } from '@Src/modules/auth/tokens.service';
import { UserModule } from '@Src/modules/user/user.module';
import { ExpenseModule } from '@Module/expense/expense.module';

@Module({
  providers: [
    JwtService,
    JwtStrategy,
    AuthService,
    SessionService,
    TokensService,
  ],
  controllers: [AuthController],
  imports: [UserModule, PassportModule, forwardRef(() => ExpenseModule)],
  exports: [JwtStrategy, AuthService, SessionService, TokensService],
})
export class AuthModule {}
