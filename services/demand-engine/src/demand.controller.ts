import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { DemandService } from './demand.service';

export interface ZoneCoordinates {
  lat: number;
  lng: number;
  radius?: number;
}

export interface DemandData {
  zoneId: string;
  coordinates: ZoneCoordinates;
  tripCount: number;
  timestamp: Date;
}

@Controller('demand')
export class DemandController {
  constructor(private demandService: DemandService) {}

  @Get('multiplier')
  getDemandMultiplier(@Query('lat') lat: string, @Query('lng') lng: string) {
    return this.demandService.getDemandMultiplier(parseFloat(lat), parseFloat(lng));
  }

  @Get('zones')
  getHighDemandZones() {
    return this.demandService.getHighDemandZones();
  }

  @Post('data')
  recordDemandData(@Body() data: DemandData) {
    return this.demandService.recordDemandData(data);
  }

  @Get('prediction')
  getPrediction(@Query('zoneId') zoneId: string) {
    return this.demandService.getPrediction(zoneId);
  }

  @Get('heatmap')
  getHeatmapData(@Query('bounds') bounds?: string) {
    return this.demandService.getHeatmapData(bounds);
  }
}