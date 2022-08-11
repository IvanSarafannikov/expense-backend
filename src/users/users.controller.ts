import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import type { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get(':userId')
  getUser(@Param('userId') userId: number): Promise<User | null> {
    return this.usersService.getUserById(userId);
  }

  @Post()
  createUser(@Body() user: User): Promise<User> {
    return this.usersService.createUser(user);
  }

  @Patch(':userId')
  updateUser(
    @Param('userId') userId: number,
    @Body() userDataToUpdate: User,
  ): Promise<User> {
    return this.usersService.updateUser(userId, userDataToUpdate);
  }

  @Delete(':userId')
  deleteUser(@Param('userId') userId: number): Promise<null> {
    return this.usersService.deleteUserById(userId);
  }
}
