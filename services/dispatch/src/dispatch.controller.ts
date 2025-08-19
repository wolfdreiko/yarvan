import { Controller, Post, Body, Get } from '@nestjs/common';
import { DispatchService } from './dispatch.service';

@Controller('dispatch')
export class DispatchController {
  constructor(private readonly dispatchService: DispatchService) {}

  @Post('request')
  async requestTrip(@Body() tripData: any) {
    const trip = {
      id: `trip_${Date.now()}`,
      ...tripData
    };
    return this.dispatchService.addTripRequest(trip);
  }

  @Post('driver-location')
  async updateDriverLocation(@Body() locationData: any) {
    return this.dispatchService.updateDriverLocation(locationData);
  }

  @Post('assign')
  async assignTrip() {
    return this.dispatchService.assignNextTrip();
  }

  @Get('status')
  async getStatus() {
    return this.dispatchService.getQueueStatus();
  }
}