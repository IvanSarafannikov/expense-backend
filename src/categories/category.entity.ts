import { Transaction } from 'src/transactions/transaction.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
@Entity({ name: 'categories' })
@Unique(['user', 'label'])
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  label!: string;

  @ManyToOne(() => User, (user) => user.categories, { onDelete: 'CASCADE' })
  user!: User;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions!: Transaction[];
}
