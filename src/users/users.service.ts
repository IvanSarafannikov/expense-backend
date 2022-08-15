import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import type { Repository } from 'typeorm';
import { User } from './user.entity';
import bcrypt from 'bcrypt';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @Inject(forwardRef(() => CategoriesService))
    private readonly categoriesService: CategoriesService,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['categories'] });
  }

  async getUserById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: { categories: true },
    });
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async getUserByRefreshToken(refreshToken: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { refreshToken } });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);

    await this.usersRepository.save(user);

    const categories = await this.categoriesService.createDefaultCategories(
      user,
    );

    user.categories = categories;

    const hashedPassword = await bcrypt.hash(createUserDto.password, 5);
    user.password = hashedPassword;

    return await this.usersRepository.save(user);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException('User you want to update does not exists');
    }

    const hashedPassword = updateUserDto.password
      ? await bcrypt.hash(updateUserDto.password, 5)
      : undefined;

    return this.usersRepository.save({
      ...user,
      ...updateUserDto,
      password: hashedPassword || user.password,
    });
  }

  async updateUserRefreshToken(
    id: number,
    refreshToken: string,
  ): Promise<null> {
    await this.usersRepository.update({ id }, { refreshToken });
    return null;
  }

  async deleteUserRefreshToken(id: number): Promise<null> {
    await this.usersRepository.update({ id }, { refreshToken: '' });
    return null;
  }

  async deleteUserById(id: number): Promise<null> {
    const result = await this.usersRepository.delete({ id });

    if (!result.affected) {
      throw new BadRequestException('User you want to delete does not exists');
    }

    return null;
  }
}
