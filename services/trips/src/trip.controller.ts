import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto, UpdateTripDto } from './trip.dto';

@Controller('trips')
export class TripController {
  constructor(private tripService: TripService) {}

  @Post()
  create(@Body() dto: CreateTripDto) {
    return this.tripService.create(dto);
  }

  @Get()
  findAll() {
    return this.tripService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tripService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTripDto) {
    return this.tripService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tripService.remove(id);
  }

  @Put(':id/accept')
  acceptTrip(@Param('id', ParseIntPipe) id: number, @Body('driverId') driverId: number) {
    return this.tripService.acceptTrip(id, driverId);
  }

  @Put(':id/start')
  startTrip(@Param('id', ParseIntPipe) id: number) {
    return this.tripService.startTrip(id);
  }

  @Put(':id/complete')
  completeTrip(@Param('id', ParseIntPipe) id: number, @Body() dto: { fare: number; distance: number }) {
    return this.tripService.completeTrip(id, dto.fare, dto.distance);
  }
}