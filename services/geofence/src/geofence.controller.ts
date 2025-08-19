import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { GeofenceService } from './geofence.service';
import { CreateGeofenceDto, UpdateGeofenceDto, CheckLocationDto } from './geofence.dto';

@Controller('geofence')
export class GeofenceController {
  constructor(private geofenceService: GeofenceService) {}

  @Post()
  create(@Body() dto: CreateGeofenceDto) {
    return this.geofenceService.create(dto);
  }

  @Get()
  findAll() {
    return this.geofenceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.geofenceService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGeofenceDto) {
    return this.geofenceService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.geofenceService.remove(id);
  }

  @Post('check')
  checkLocation(@Body() dto: CheckLocationDto) {
    return this.geofenceService.checkLocation(dto.lat, dto.lng, dto.licensePlate);
  }

  @Get('check-coordinates')
  checkCoordinates(@Query('lat') lat: string, @Query('lng') lng: string, @Query('plate') plate?: string) {
    return this.geofenceService.checkLocation(parseFloat(lat), parseFloat(lng), plate);
  }
}