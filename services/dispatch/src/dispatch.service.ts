import { Injectable } from '@nestjs/common';
import { TripRequest, DriverLocation } from './dispatch.controller';

@Injectable()
export class DispatchService {
  private tripQueue: TripRequest[] = [];
  private availableDrivers: Map<number, DriverLocation> = new Map();

  async addTripRequest(tripRequest: TripRequest) {
    this.tripQueue.push(tripRequest);
    console.log(`Trip ${tripRequest.id} added to queue`);
    
    // Try immediate assignment
    const assignment = await this.assignDriver(tripRequest.id);
    return { tripRequest, assignment };
  }

  async updateDriverLocation(location: DriverLocation) {
    if (location.status === 'online') {
      this.availableDrivers.set(location.driverId, location);
    } else {
      this.availableDrivers.delete(location.driverId);
    }
    return { success: true, availableDrivers: this.availableDrivers.size };
  }

  async assignDriver(tripId: number) {
    const tripIndex = this.tripQueue.findIndex(trip => trip.id === tripId);
    if (tripIndex === -1) return { error: 'Trip not found in queue' };

    const trip = this.tripQueue[tripIndex];
    const nearestDriver = this.findNearestDriver(trip.originLat, trip.originLng);

    if (!nearestDriver) {
      return { error: 'No available drivers' };
    }

    // Remove trip from queue and driver from available
    this.tripQueue.splice(tripIndex, 1);
    this.availableDrivers.delete(nearestDriver.driverId);

    console.log(`Trip ${tripId} assigned to driver ${nearestDriver.driverId}`);
    
    return {
      tripId,
      driverId: nearestDriver.driverId,
      eta: this.calculateETA(trip.originLat, trip.originLng, nearestDriver.lat, nearestDriver.lng),
      distance: this.calculateDistance(trip.originLat, trip.originLng, nearestDriver.lat, nearestDriver.lng)
    };
  }

  private findNearestDriver(lat: number, lng: number): DriverLocation | null {
    let nearest: DriverLocation | null = null;
    let minDistance = Infinity;

    for (const driver of this.availableDrivers.values()) {
      const distance = this.calculateDistance(lat, lng, driver.lat, driver.lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = driver;
      }
    }

    return nearest;
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  private calculateETA(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const distance = this.calculateDistance(lat1, lng1, lat2, lng2);
    return Math.round(distance / 0.5); // Assuming 30 km/h average speed
  }

  async getQueue() {
    return {
      pendingTrips: this.tripQueue.length,
      availableDrivers: this.availableDrivers.size,
      queue: this.tripQueue
    };
  }
}