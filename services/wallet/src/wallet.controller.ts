import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto, DepositDto, WithdrawDto, TripPaymentDto } from './wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Post()
  create(@Body() dto: CreateWalletDto) {
    return this.walletService.create(dto);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.walletService.findByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.walletService.findOne(id);
  }

  @Post(':id/deposit')
  deposit(@Param('id', ParseIntPipe) id: number, @Body() dto: DepositDto) {
    return this.walletService.deposit(id, dto);
  }

  @Post(':id/withdraw')
  withdraw(@Param('id', ParseIntPipe) id: number, @Body() dto: WithdrawDto) {
    return this.walletService.withdraw(id, dto);
  }

  @Post(':id/trip-payment')
  processTripPayment(@Param('id', ParseIntPipe) id: number, @Body() dto: TripPaymentDto) {
    return this.walletService.processTripPayment(id, dto);
  }

  @Get(':id/transactions')
  getTransactions(@Param('id', ParseIntPipe) id: number) {
    return this.walletService.getTransactions(id);
  }

  @Get(':id/balance')
  getBalance(@Param('id', ParseIntPipe) id: number) {
    return this.walletService.getBalance(id);
  }
}