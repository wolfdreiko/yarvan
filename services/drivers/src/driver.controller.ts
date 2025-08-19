import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { DriverService } from './driver.service';
import { CreateDriverDto, UpdateDriverDto, CreateVehicleDto } from './driver.dto';

@Controller('drivers')
export class DriverController {
  constructor(private driverService: DriverService) {}

  @Post()
  create(@Body() dto: CreateDriverDto) {
    return this.driverService.create(dto);
  }

  @Get()
  findAll() {
    return this.driverService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.driverService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDriverDto) {
    return this.driverService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.driverService.remove(id);
  }

  @Post(':id/vehicles')
  addVehicle(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateVehicleDto) {
    return this.driverService.addVehicle({ ...dto, driverId: id });
  }

  @Put(':id/status')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDriverDto) {
    return this.driverService.updateStatus(id, dto.status);
  }
}