import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccessAuthGuard } from 'src/auth/guards/access-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { User, UserRoles } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(AccessAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  getUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':userId')
  getUser(@Param('userId') userId: number) {
    return this.usersService.getUserById(userId);
  }

  @Post()
  createUser(@Body() user: User) {
    return this.usersService.createUser(user);
  }

  @Patch(':userId')
  updateUser(@Param('userId') userId: number, @Body() userDataToUpdate: User) {
    return this.usersService.updateUser(userId, userDataToUpdate);
  }

  @Delete(':userId')
  deleteUser(@Param('userId') userId: number) {
    return this.usersService.deleteUserById(userId);
  }
}
