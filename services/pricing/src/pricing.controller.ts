import { Controller, Post, Body } from '@nestjs/common';
import { PricingService } from './pricing.service';

@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post('quote')
  async getQuote(@Body() body: any) {
    const { originLat, originLng, destLat, destLng, serviceType } = body;
    return this.pricingService.calculateQuote(
      +originLat,
      +originLng,
      +destLat,
      +destLng,
      serviceType || 'standard',
    );
  }
}