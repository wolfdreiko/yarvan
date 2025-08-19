import { Injectable } from '@nestjs/common';

export interface TripRequest {
  id: string;
  passengerId: number;
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
  originAddress: string;
  destinationAddress: string;
}

export interface DriverLocation {
  driverId: number;
  lat: number;
  lng: number;
  status: 'online' | 'offline';
}

@Injectable()
export class DispatchService {
  private tripQueue: TripRequest[] = [];
  private availableDrivers: Map<number, DriverLocation> = new Map();

  async addTripRequest(trip: TripRequest) {
    this.tripQueue.push(trip);
    console.log(`Trip ${trip.id} added to queue`);
    
    // Intentar asignar inmediatamente
    const assignment = await this.assignNextTrip();
    return assignment || { success: true, queued: true };
  }

  async updateDriverLocation(location: DriverLocation) {
    if (location.status === 'online') {
      this.availableDrivers.set(location.driverId, location);
      console.log(`Driver ${location.driverId} is now online`);
    } else {
      this.availableDrivers.delete(location.driverId);
      console.log(`Driver ${location.driverId} is now offline`);
    }
    return { success: true };
  }

  async assignNextTrip() {
    if (this.tripQueue.length === 0) {
      return { error: 'No trips in queue' };
    }

    const trip = this.tripQueue.shift();
    const drivers = Array.from(this.availableDrivers.values());
    
    if (drivers.length === 0) {
      // Reencolar el viaje
      this.tripQueue.unshift(trip);
      return { error: 'No drivers available' };
    }

    // Encontrar conductor más cercano
    let nearest: { driver: DriverLocation; distance: number } | null = null;
    
    for (const driver of drivers) {
      const distance = this.calculateDistance(
        trip.originLat,
        trip.originLng,
        driver.lat,
        driver.lng,
      );
      
      if (!nearest || distance < nearest.distance) {
        nearest = { driver, distance };
      }
    }

    if (nearest) {
      // Remover conductor de disponibles
      this.availableDrivers.delete(nearest.driver.driverId);
      
      console.log(`Trip ${trip.id} assigned to driver ${nearest.driver.driverId}`);
      
      return {
        tripId: trip.id,
        driverId: nearest.driver.driverId,
        distance: Number(nearest.distance.toFixed(2)),
        eta: Math.ceil(nearest.distance * 2) // 2 min por km estimado
      };
    }

    return { error: 'No suitable driver found' };
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  async getQueueStatus() {
    return {
      queueLength: this.tripQueue.length,
      availableDrivers: this.availableDrivers.size,
      drivers: Array.from(this.availableDrivers.values())
    };
  }
}