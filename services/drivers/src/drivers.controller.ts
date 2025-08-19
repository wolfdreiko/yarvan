import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { DriversService } from './drivers.service';

@Controller('drivers')
export class DriversController {
  constructor(private driversService: DriversService) {}

  @Get()
  findAll() {
    return this.driversService.findAll();
  }

  @Post()
  create(@Body() driverData: any) {
    return this.driversService.create(driverData);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.driversService.findById(+id);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.driversService.updateStatus(+id, body.status);
  }
}