import { Category } from 'src/categories/category.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'transactions' })
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  label!: string;

  @Column({ type: 'date' })
  date!: Date;

  @Column()
  amount!: number;

  @ManyToOne(() => Category, (category) => category.transactions, {
    onDelete: 'CASCADE',
  })
  category!: Category;

  @ManyToOne(() => User, (user) => user.transactions)
  user!: User;
}
