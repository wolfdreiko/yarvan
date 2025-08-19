import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';

@Module({
  controllers: [HealthController, TripsController],
  providers: [TripsService],
})
export class AppModule {}