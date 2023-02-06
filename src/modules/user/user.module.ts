import { UserController } from '@Module/user/user.controller';
import { Module } from '@nestjs/common';

import { UserService } from '@Src/modules/user/user.service';

@Module({
  providers: [UserService],
  controllers: [UserController],

  imports: [],
  exports: [UserService],
})
export class UserModule {}
