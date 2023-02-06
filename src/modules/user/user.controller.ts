import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { JwtProtectedRequest } from '@Module/auth/interfaces/protected-request.interface';
import { JwtAuthGuard } from '@Module/auth/jwt-auth.guard';
import { UserDto } from '@Module/user/dto/user.dto';
import { UserService } from '@Module/user/user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ description: 'Get own user profile' })
  @ApiOkResponse({ description: 'User received successfully', type: UserDto })
  @ApiUnauthorizedResponse({ description: 'User unauthorized' })
  @ApiBasicAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @Get('')
  async getUser(@Req() req: JwtProtectedRequest) {
    const { password, ...user } = await this.userService.getExisting({
      where: {
        id: req.user.id,
      },
    });

    return user;
  }
}
