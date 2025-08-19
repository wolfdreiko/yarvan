import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip, TripStatus } from './trip.entity';
import { CreateTripDto, UpdateTripDto } from './trip.dto';
import { TripGateway } from './trip.gateway';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip) private tripRepository: Repository<Trip>,
    private tripGateway: TripGateway
  ) {}

  async create(dto: CreateTripDto) {
    const trip = this.tripRepository.create(dto);
    const savedTrip = await this.tripRepository.save(trip);
    this.tripGateway.emitTripCreated(savedTrip);
    return savedTrip;
  }

  findAll() {
    return this.tripRepository.find();
  }

  async findOne(id: number) {
    const trip = await this.tripRepository.findOne({ where: { id } });
    if (!trip) throw new NotFoundException('Trip not found');
    return trip;
  }

  async update(id: number, dto: UpdateTripDto) {
    await this.findOne(id);
    await this.tripRepository.update(id, dto);
    const updatedTrip = await this.findOne(id);
    this.tripGateway.emitTripUpdated(updatedTrip);
    return updatedTrip;
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.tripRepository.delete(id);
  }

  async acceptTrip(id: number, driverId: number) {
    return this.update(id, { driverId, status: TripStatus.ACCEPTED });
  }

  async startTrip(id: number) {
    return this.update(id, { status: TripStatus.IN_PROGRESS });
  }

  async completeTrip(id: number, fare: number, distance: number) {
    return this.update(id, { status: TripStatus.COMPLETED, fare, distance });
  }
}