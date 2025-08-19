import { Injectable } from '@nestjs/common';
import { DemandData } from './demand.controller';

interface Zone {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  radius: number;
  baseMultiplier: number;
  currentMultiplier: number;
  tripCount: number;
  lastUpdated: Date;
}

@Injectable()
export class DemandService {
  private zones: Map<string, Zone> = new Map();
  private demandHistory: DemandData[] = [];

  constructor() {
    this.initializeZones();
  }

  getDemandMultiplier(lat: number, lng: number) {
    const zone = this.findZoneByCoordinates(lat, lng);
    
    if (!zone) {
      return {
        multiplier: 1.0,
        zoneId: null,
        zoneName: 'Unknown',
        reason: 'Outside known zones'
      };
    }

    // Add some randomness for demo purposes
    const timeMultiplier = this.getTimeBasedMultiplier();
    const finalMultiplier = Math.round((zone.currentMultiplier * timeMultiplier) * 100) / 100;

    return {
      multiplier: finalMultiplier,
      zoneId: zone.id,
      zoneName: zone.name,
      baseMultiplier: zone.baseMultiplier,
      timeMultiplier,
      tripCount: zone.tripCount,
      reason: finalMultiplier > 1.5 ? 'High demand area' : 'Normal demand'
    };
  }

  getHighDemandZones() {
    const highDemandZones = Array.from(this.zones.values())
      .filter(zone => zone.currentMultiplier > 1.3)
      .sort((a, b) => b.currentMultiplier - a.currentMultiplier);

    return {
      zones: highDemandZones,
      count: highDemandZones.length,
      timestamp: new Date()
    };
  }

  recordDemandData(data: DemandData) {
    this.demandHistory.push(data);
    
    // Update zone if it exists
    const zone = this.zones.get(data.zoneId);
    if (zone) {
      zone.tripCount = data.tripCount;
      zone.lastUpdated = new Date();
      
      // Simple demand calculation based on trip count
      if (data.tripCount > 10) {
        zone.currentMultiplier = Math.min(zone.baseMultiplier * 1.8, 3.0);
      } else if (data.tripCount > 5) {
        zone.currentMultiplier = zone.baseMultiplier * 1.4;
      } else {
        zone.currentMultiplier = zone.baseMultiplier;
      }
    }

    return { success: true, recordedAt: new Date() };
  }

  getPrediction(zoneId: string) {
    const zone = this.zones.get(zoneId);
    if (!zone) {
      return { error: 'Zone not found' };
    }

    // Simple prediction based on historical data and time
    const hour = new Date().getHours();
    const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
    const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;

    let predictedMultiplier = zone.baseMultiplier;
    
    if (isRushHour && !isWeekend) {
      predictedMultiplier *= 1.6;
    } else if (isWeekend && (hour >= 20 && hour <= 2)) {
      predictedMultiplier *= 1.4;
    }

    return {
      zoneId,
      zoneName: zone.name,
      currentMultiplier: zone.currentMultiplier,
      predictedMultiplier: Math.round(predictedMultiplier * 100) / 100,
      confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
      factors: {
        isRushHour,
        isWeekend,
        hour,
        historicalTripCount: zone.tripCount
      },
      recommendation: predictedMultiplier > 1.5 ? 'High demand expected' : 'Normal demand expected'
    };
  }

  getHeatmapData(bounds?: string) {
    const zones = Array.from(this.zones.values());
    
    return {
      heatmapPoints: zones.map(zone => ({
        lat: zone.coordinates.lat,
        lng: zone.coordinates.lng,
        intensity: zone.currentMultiplier,
        weight: zone.tripCount || 1,
        zoneId: zone.id,
        zoneName: zone.name
      })),
      bounds,
      timestamp: new Date(),
      legend: {
        low: { multiplier: 1.0, color: '#00ff00' },
        medium: { multiplier: 1.5, color: '#ffff00' },
        high: { multiplier: 2.0, color: '#ff0000' }
      }
    };
  }

  private initializeZones() {
    // Sample zones for Bogotá
    const sampleZones: Zone[] = [
      {
        id: 'zona-rosa',
        name: 'Zona Rosa',
        coordinates: { lat: 4.6097, lng: -74.0817 },
        radius: 1000,
        baseMultiplier: 1.2,
        currentMultiplier: 1.2,
        tripCount: 0,
        lastUpdated: new Date()
      },
      {
        id: 'centro-historico',
        name: 'Centro Histórico',
        coordinates: { lat: 4.5981, lng: -74.0758 },
        radius: 1500,
        baseMultiplier: 1.1,
        currentMultiplier: 1.1,
        tripCount: 0,
        lastUpdated: new Date()
      },
      {
        id: 'aeropuerto',
        name: 'Aeropuerto El Dorado',
        coordinates: { lat: 4.7016, lng: -74.1469 },
        radius: 2000,
        baseMultiplier: 1.5,
        currentMultiplier: 1.5,
        tripCount: 0,
        lastUpdated: new Date()
      },
      {
        id: 'chapinero',
        name: 'Chapinero',
        coordinates: { lat: 4.6533, lng: -74.0636 },
        radius: 1200,
        baseMultiplier: 1.3,
        currentMultiplier: 1.3,
        tripCount: 0,
        lastUpdated: new Date()
      }
    ];

    sampleZones.forEach(zone => {
      this.zones.set(zone.id, zone);
    });
  }

  private findZoneByCoordinates(lat: number, lng: number): Zone | null {
    for (const zone of this.zones.values()) {
      const distance = this.calculateDistance(
        lat, lng, 
        zone.coordinates.lat, zone.coordinates.lng
      );
      
      if (distance <= zone.radius) {
        return zone;
      }
    }
    return null;
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  private getTimeBasedMultiplier(): number {
    const hour = new Date().getHours();
    const day = new Date().getDay();
    
    // Rush hours
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      return day === 0 || day === 6 ? 1.2 : 1.5; // Less intense on weekends
    }
    
    // Night hours (weekend)
    if ((day === 5 || day === 6) && (hour >= 20 || hour <= 2)) {
      return 1.3;
    }
    
    return 1.0;
  }
}