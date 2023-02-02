import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from 'src/entities/User.entity';

@Entity('Sessions')
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;

  @Column({
    length: 30,
  })
  deviceName: string;

  @Column({
    length: 1024,
  })
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
