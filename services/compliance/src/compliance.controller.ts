import { Controller, Get, Post, Put, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { CreateComplianceDto, UpdateComplianceDto } from './compliance.dto';

@Controller('compliance')
export class ComplianceController {
  constructor(private complianceService: ComplianceService) {}

  @Post()
  create(@Body() dto: CreateComplianceDto) {
    return this.complianceService.create(dto);
  }

  @Get('vehicle/:vehicleId')
  findByVehicle(@Param('vehicleId', ParseIntPipe) vehicleId: number) {
    return this.complianceService.findByVehicle(vehicleId);
  }

  @Get('plate/:plate')
  findByPlate(@Param('plate') plate: string) {
    return this.complianceService.findByPlate(plate);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateComplianceDto) {
    return this.complianceService.update(id, dto);
  }

  @Get('check-plate')
  checkPlate(@Query('plate') plate: string) {
    return this.complianceService.checkPlateCompliance(plate);
  }

  @Get('calculate-dates')
  calculateDates(@Query('plate') plate: string) {
    return this.complianceService.calculateComplianceDates(plate);
  }

  @Get('reminders')
  getReminders(@Query('days') days?: string) {
    const daysAhead = days ? parseInt(days) : 30;
    return this.complianceService.getUpcomingReminders(daysAhead);
  }

  @Get('expired')
  getExpired() {
    return this.complianceService.getExpiredDocuments();
  }
}