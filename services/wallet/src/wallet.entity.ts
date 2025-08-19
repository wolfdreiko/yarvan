import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userId: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  savingsBalance: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Transaction, transaction => transaction.wallet)
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}