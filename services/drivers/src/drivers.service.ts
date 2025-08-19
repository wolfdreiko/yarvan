import { Injectable } from '@nestjs/common';

@Injectable()
export class DriversService {
  private drivers = [];

  findAll() {
    return this.drivers;
  }

  create(driverData: any) {
    const driver = {
      id: Date.now(),
      ...driverData,
      status: 'offline',
      vehicles: [],
      createdAt: new Date()
    };
    this.drivers.push(driver);
    return driver;
  }

  findById(id: number) {
    return this.drivers.find(driver => driver.id === id);
  }

  updateStatus(id: number, status: string) {
    const driver = this.findById(id);
    if (driver) {
      driver.status = status;
    }
    return driver;
  }
}