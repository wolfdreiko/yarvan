import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PricingService {
  private baseFee = parseFloat(process.env.BASE_FEE ?? '3500');
  private perKm = parseFloat(process.env.PER_KM ?? '1200');
  private perMin = parseFloat(process.env.PER_MIN ?? '200');

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private estimateTime(distanceKm: number): number {
    const avgSpeedKmH = parseFloat(process.env.AVG_SPEED_KMH ?? '25');
    return Math.ceil((distanceKm / avgSpeedKmH) * 60);
  }

  async getSurgeMultiplier(zoneId: string): Promise<number> {
    try {
      const response = await axios.get(
        `${process.env.DEMAND_ENGINE_URL || 'http://localhost:3009'}/demand/multiplier?zone=${zoneId}`,
      );
      return response.data?.multiplier ?? 1;
    } catch (error) {
      return 1; // Default multiplier
    }
  }

  async calculateQuote(
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number,
    serviceType: string,
  ) {
    const distanceKm = this.calculateDistance(originLat, originLng, destLat, destLng);
    const timeMin = this.estimateTime(distanceKm);

    // Simular zona por ahora
    const zoneId = `zone_${Math.floor(originLat * 100) % 10}`;
    const surge = await this.getSurgeMultiplier(zoneId);

    const fare = Math.round((this.baseFee + distanceKm * this.perKm + timeMin * this.perMin) * surge);
    
    return { 
      fare, 
      distanceKm: Number(distanceKm.toFixed(2)), 
      timeMin, 
      surge, 
      zoneId,
      breakdown: {
        baseFee: this.baseFee,
        distanceFee: Math.round(distanceKm * this.perKm),
        timeFee: Math.round(timeMin * this.perMin),
        surgeMultiplier: surge
      }
    };
  }
}