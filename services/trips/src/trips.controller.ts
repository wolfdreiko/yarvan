import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { TripsService } from './trips.service';

@Controller('trips')
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Get()
  findAll() {
    return this.tripsService.findAll();
  }

  @Post()
  create(@Body() tripData: any) {
    return this.tripsService.create(tripData);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.tripsService.findById(+id);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.tripsService.updateStatus(+id, body.status);
  }
}