import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRoles {
  ADMIN = 'Administrator',
  USER = 'User',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  displayName!: string;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.USER,
  })
  role!: UserRoles;

  @Column()
  password!: string;

  @Column({ nullable: true })
  refreshToken!: string;
}
