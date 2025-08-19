import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { DispatchService } from './dispatch.service';

export interface TripRequest {
  id: number;
  passengerId: number;
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
}

export interface DriverLocation {
  driverId: number;
  lat: number;
  lng: number;
  status: string;
}

@Controller('dispatch')
export class DispatchController {
  constructor(private dispatchService: DispatchService) {}

  @Post('request')
  async requestTrip(@Body() tripRequest: TripRequest) {
    return this.dispatchService.addTripRequest(tripRequest);
  }

  @Post('driver-location')
  async updateDriverLocation(@Body() location: DriverLocation) {
    return this.dispatchService.updateDriverLocation(location);
  }

  @Get('assign/:tripId')
  async assignDriver(@Param('tripId') tripId: string) {
    return this.dispatchService.assignDriver(parseInt(tripId));
  }

  @Get('queue')
  async getQueue() {
    return this.dispatchService.getQueue();
  }
}