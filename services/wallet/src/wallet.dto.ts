import { IsNumber, IsString, IsOptional, IsEnum, Min } from 'class-validator';
import { TransactionType } from './transaction.entity';

export class CreateWalletDto {
  @IsNumber()
  userId: number;
}

export class DepositDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  referenceId?: string;
}

export class WithdrawDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class TripPaymentDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsNumber()
  tripId: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  savingsPercentage?: number; // Percentage to retain for savings (0-100)
}