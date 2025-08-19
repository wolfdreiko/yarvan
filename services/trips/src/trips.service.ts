import { Injectable } from '@nestjs/common';

@Injectable()
export class TripsService {
  private trips = [];

  findAll() {
    return this.trips;
  }

  create(tripData: any) {
    const trip = {
      id: Date.now(),
      ...tripData,
      status: 'pending',
      fare: this.calculateFare(tripData.distance || 5),
      createdAt: new Date()
    };
    this.trips.push(trip);
    return trip;
  }

  findById(id: number) {
    return this.trips.find(trip => trip.id === id);
  }

  updateStatus(id: number, status: string) {
    const trip = this.findById(id);
    if (trip) {
      trip.status = status;
      trip.updatedAt = new Date();
    }
    return trip;
  }

  private calculateFare(distance: number): number {
    const baseRate = 3500; // Tarifa base
    const perKm = 1200; // Por kilómetro
    return baseRate + (distance * perKm);
  }
}