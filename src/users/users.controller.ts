import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthUser } from 'src/auth/decorators/user.decorator';
import { AccessAuthGuard } from 'src/auth/guards/access-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRoles } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AccessAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN)
  getUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get()
  getCurrentUser(@AuthUser() user: User): User {
    return user;
  }

  @Get(':userId')
  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN)
  getUser(@Param('userId') userId: number): Promise<User | null> {
    return this.usersService.getUserById(userId);
  }

  // There is auth/register route for proper registration
  // @Post()
  // createUser(@Body() user: User): Promise<User> {
  //   return this.usersService.createUser(user);
  // }

  @Patch()
  updateCurrentUser(
    @AuthUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(user.id, updateUserDto);
  }

  @Patch(':userId')
  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN)
  updateUser(
    @Param('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @Delete()
  deleteCurrentUser(@AuthUser() user: User): Promise<null> {
    return this.usersService.deleteUserById(user.id);
  }

  @Delete(':userId')
  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN)
  deleteUser(@Param('userId') userId: number): Promise<null> {
    return this.usersService.deleteUserById(userId);
  }
}
