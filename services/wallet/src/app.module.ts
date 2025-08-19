import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health.controller';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { Wallet } from './wallet.entity';
import { Transaction } from './transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'yarvan',
      password: process.env.DB_PASS || 'yarvan123',
      database: process.env.DB_NAME || 'yarvan_wallet',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forFeature([Wallet, Transaction]),
  ],
  controllers: [HealthController, WalletController],
  providers: [WalletService],
})
export class AppModule {}