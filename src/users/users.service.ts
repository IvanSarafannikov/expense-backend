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

  async createUser(userData: User): Promise<User> {
    // TODO: implement create-user dto on which create user for better control
    const user = this.usersRepository.create(userData);

    await this.usersRepository.save(user);

    const categories = await this.categoriesService.createDefaultCategories(
      user,
    );

    user.categories = categories;

    await this.usersRepository.save(user);

    return user;
  }

  async updateUser(id: number, userDataToUpdate: User): Promise<User> {
    // TODO: create update-user dto and update entity with it to prevent updating unwanted fields and validation

    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException('User you want to update does not exists');
    }

    return this.usersRepository.save({ ...user, ...userDataToUpdate });
  }

  async deleteUserRefreshToken(id: number): Promise<null> {
    await this.usersRepository.update({ id }, { refreshToken: '' });
    return null;
  }

  async deleteUserById(id: number): Promise<null> {
    // TODO: delete related entities
    const result = await this.usersRepository.delete({ id });

    if (!result.affected) {
      throw new BadRequestException('User you want to delete does not exists');
    }

    return null;
  }
}
