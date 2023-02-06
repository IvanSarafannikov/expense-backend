import { Module } from '@nestjs/common';

import { AuthModule } from '@Src/modules/auth/auth.module';
import { UserModule } from '@Module/user/user.module';

@Module({
  controllers: [],
  providers: [],
  imports: [AuthModule, UserModule],
})
export class AppModule {}
