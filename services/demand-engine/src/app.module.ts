import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { DemandController } from './demand.controller';
import { DemandService } from './demand.service';

@Module({
  controllers: [HealthController, DemandController],
  providers: [DemandService],
})
export class AppModule {}