import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { DispatchController } from './dispatch.controller';
import { DispatchService } from './dispatch.service';

@Module({
  controllers: [HealthController, DispatchController],
  providers: [DispatchService],
})
export class AppModule {}