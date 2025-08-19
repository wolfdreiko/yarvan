import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Wallet } from './wallet.entity';

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRIP_PAYMENT = 'trip_payment',
  SAVINGS_RETENTION = 'savings_retention',
  SAVINGS_WITHDRAWAL = 'savings_withdrawal'
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  referenceId: string; // Trip ID, external payment ID, etc.

  @ManyToOne(() => Wallet, wallet => wallet.transactions)
  @JoinColumn({ name: 'walletId' })
  wallet: Wallet;

  @Column()
  walletId: number;

  @CreateDateColumn()
  createdAt: Date;
}