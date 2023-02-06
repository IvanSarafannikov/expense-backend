import { Module } from '@nestjs/common';

import { UserService } from '@Src/modules/user/user.service';

@Module({
  providers: [UserService],
  controllers: [],
  imports: [],
  exports: [UserService],
})
export class UserModule {}
