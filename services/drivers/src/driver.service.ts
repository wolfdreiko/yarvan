import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver, DriverStatus } from './driver.entity';
import { Vehicle } from './vehicle.entity';
import { CreateDriverDto, UpdateDriverDto, CreateVehicleDto } from './driver.dto';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver) private driverRepository: Repository<Driver>,
    @InjectRepository(Vehicle) private vehicleRepository: Repository<Vehicle>
  ) {}

  create(dto: CreateDriverDto) {
    const driver = this.driverRepository.create(dto);
    return this.driverRepository.save(driver);
  }

  findAll() {
    return this.driverRepository.find({ relations: ['vehicles'] });
  }

  async findOne(id: number) {
    const driver = await this.driverRepository.findOne({ where: { id }, relations: ['vehicles'] });
    if (!driver) throw new NotFoundException('Driver not found');
    return driver;
  }

  async update(id: number, dto: UpdateDriverDto) {
    await this.findOne(id);
    await this.driverRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.driverRepository.delete(id);
  }

  async addVehicle(dto: CreateVehicleDto) {
    const vehicle = this.vehicleRepository.create(dto);
    return this.vehicleRepository.save(vehicle);
  }

  async updateStatus(id: number, status: DriverStatus) {
    await this.findOne(id);
    await this.driverRepository.update(id, { status });
    return this.findOne(id);
  }
}