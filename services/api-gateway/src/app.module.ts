import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HealthController } from './health.controller';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'yarvan-secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
    }),
  ],
  controllers: [HealthController, GatewayController],
  providers: [GatewayService, AuthGuard],
})
export class AppModule {}