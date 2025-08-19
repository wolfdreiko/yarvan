import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';

@Module({
  controllers: [HealthController, DriversController],
  providers: [DriversService],
})
export class AppModule {}