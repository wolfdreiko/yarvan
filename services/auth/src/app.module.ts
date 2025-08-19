import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HealthController } from './health.controller';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'yarvan-secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
    }),
  ],
  controllers: [HealthController, AuthController],
  providers: [AuthService],
})
export class AppModule {}