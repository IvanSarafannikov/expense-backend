import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getAllUsers() {
    return this.usersRepository.find();
  }

  async getUserById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async getUserByUsername(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  async createUser(userData: User) {
    // TODO: implement create-user dto on which create user for better control
    // TODO: create related entities
    const user = this.usersRepository.create(userData);
    await this.usersRepository.save(user);
    return user;
  }

  async updateUser(id: number, userDataToUpdate: User) {
    // TODO: create update-user dto and update entity with it to prevent updating unwanted fields and validation

    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException('User you want to update does not exists');
    }

    return this.usersRepository.save({ ...user, ...userDataToUpdate });
  }

  async deleteUserById(id: number) {
    // TODO: delete related entities
    const result = await this.usersRepository.delete({ id });

    if (!result.affected) {
      throw new BadRequestException('User you want to delete does not exists');
    }

    return null;
  }
}
