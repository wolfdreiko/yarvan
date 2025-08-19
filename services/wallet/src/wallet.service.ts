import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { Transaction, TransactionType } from './transaction.entity';
import { CreateWalletDto, DepositDto, WithdrawDto, TripPaymentDto } from './wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>
  ) {}

  async create(dto: CreateWalletDto) {
    const existingWallet = await this.walletRepository.findOne({ where: { userId: dto.userId } });
    if (existingWallet) throw new BadRequestException('Wallet already exists for this user');

    const wallet = this.walletRepository.create(dto);
    return this.walletRepository.save(wallet);
  }

  async findByUserId(userId: number) {
    const wallet = await this.walletRepository.findOne({ 
      where: { userId }, 
      relations: ['transactions'] 
    });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async findOne(id: number) {
    const wallet = await this.walletRepository.findOne({ 
      where: { id }, 
      relations: ['transactions'] 
    });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async deposit(walletId: number, dto: DepositDto) {
    const wallet = await this.findOne(walletId);
    
    // Create transaction
    const transaction = this.transactionRepository.create({
      type: TransactionType.DEPOSIT,
      amount: dto.amount,
      description: dto.description || 'Wallet deposit',
      referenceId: dto.referenceId,
      walletId
    });

    // Update wallet balance
    wallet.balance = Number(wallet.balance) + Number(dto.amount);
    
    await this.transactionRepository.save(transaction);
    await this.walletRepository.save(wallet);

    return { wallet, transaction };
  }

  async withdraw(walletId: number, dto: WithdrawDto) {
    const wallet = await this.findOne(walletId);
    
    if (Number(wallet.balance) < Number(dto.amount)) {
      throw new BadRequestException('Insufficient balance');
    }

    // Create transaction
    const transaction = this.transactionRepository.create({
      type: TransactionType.WITHDRAWAL,
      amount: dto.amount,
      description: dto.description || 'Wallet withdrawal',
      walletId
    });

    // Update wallet balance
    wallet.balance = Number(wallet.balance) - Number(dto.amount);
    
    await this.transactionRepository.save(transaction);
    await this.walletRepository.save(wallet);

    return { wallet, transaction };
  }

  async processTripPayment(walletId: number, dto: TripPaymentDto) {
    const wallet = await this.findOne(walletId);
    
    if (Number(wallet.balance) < Number(dto.amount)) {
      throw new BadRequestException('Insufficient balance');
    }

    const savingsPercentage = dto.savingsPercentage || 10; // Default 10%
    const savingsAmount = (Number(dto.amount) * savingsPercentage) / 100;
    const paymentAmount = Number(dto.amount) - savingsAmount;

    // Create trip payment transaction
    const paymentTransaction = this.transactionRepository.create({
      type: TransactionType.TRIP_PAYMENT,
      amount: paymentAmount,
      description: `Trip payment #${dto.tripId}`,
      referenceId: dto.tripId.toString(),
      walletId
    });

    // Create savings retention transaction if applicable
    let savingsTransaction = null;
    if (savingsAmount > 0) {
      savingsTransaction = this.transactionRepository.create({
        type: TransactionType.SAVINGS_RETENTION,
        amount: savingsAmount,
        description: `Savings retention for trip #${dto.tripId}`,
        referenceId: dto.tripId.toString(),
        walletId
      });
    }

    // Update wallet balances
    wallet.balance = Number(wallet.balance) - Number(dto.amount);
    if (savingsAmount > 0) {
      wallet.savingsBalance = Number(wallet.savingsBalance) + savingsAmount;
    }

    await this.transactionRepository.save(paymentTransaction);
    if (savingsTransaction) {
      await this.transactionRepository.save(savingsTransaction);
    }
    await this.walletRepository.save(wallet);

    return { 
      wallet, 
      paymentTransaction, 
      savingsTransaction,
      savingsAmount,
      paymentAmount 
    };
  }

  async getTransactions(walletId: number) {
    await this.findOne(walletId); // Verify wallet exists
    return this.transactionRepository.find({ 
      where: { walletId },
      order: { createdAt: 'DESC' }
    });
  }

  async getBalance(walletId: number) {
    const wallet = await this.findOne(walletId);
    return {
      balance: wallet.balance,
      savingsBalance: wallet.savingsBalance,
      totalBalance: Number(wallet.balance) + Number(wallet.savingsBalance)
    };
  }
}