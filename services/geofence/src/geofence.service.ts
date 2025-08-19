import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Geofence, GeofenceType } from './geofence.entity';
import { CreateGeofenceDto, UpdateGeofenceDto } from './geofence.dto';

@Injectable()
export class GeofenceService {
  constructor(@InjectRepository(Geofence) private geofenceRepository: Repository<Geofence>) {}

  create(dto: CreateGeofenceDto) {
    const geofence = this.geofenceRepository.create(dto);
    return this.geofenceRepository.save(geofence);
  }

  findAll() {
    return this.geofenceRepository.find();
  }

  async findOne(id: number) {
    const geofence = await this.geofenceRepository.findOne({ where: { id } });
    if (!geofence) throw new NotFoundException('Geofence not found');
    return geofence;
  }

  async update(id: number, dto: UpdateGeofenceDto) {
    await this.findOne(id);
    await this.geofenceRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.geofenceRepository.delete(id);
  }

  async checkLocation(lat: number, lng: number, licensePlate?: string) {
    const geofences = await this.geofenceRepository.find({ where: { isActive: true } });
    const results = [];

    for (const geofence of geofences) {
      const isInside = this.pointInPolygon({ lat, lng }, geofence.polygon);
      
      if (isInside) {
        const result = {
          geofenceId: geofence.id,
          name: geofence.name,
          type: geofence.type,
          isInside: true,
          restrictions: null
        };

        if (geofence.type === GeofenceType.PICO_PLACA && licensePlate) {
          result.restrictions = this.checkPicoPlaca(licensePlate);
        }

        results.push(result);
      }
    }

    return {
      location: { lat, lng },
      licensePlate,
      geofences: results,
      hasRestrictions: results.some(r => r.restrictions?.restricted),
      isHighDemand: results.some(r => r.type === GeofenceType.HIGH_DEMAND)
    };
  }

  private pointInPolygon(point: { lat: number; lng: number }, polygon: { lat: number; lng: number }[]): boolean {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      if (((polygon[i].lat > point.lat) !== (polygon[j].lat > point.lat)) &&
          (point.lng < (polygon[j].lng - polygon[i].lng) * (point.lat - polygon[i].lat) / (polygon[j].lat - polygon[i].lat) + polygon[i].lng)) {
        inside = !inside;
      }
    }
    return inside;
  }

  private checkPicoPlaca(licensePlate: string) {
    const lastDigit = parseInt(licensePlate.slice(-1));
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hour = new Date().getHours();

    // Pico y placa rules (simplified)
    const restrictions = {
      1: [1, 2], // Monday: plates ending in 1, 2
      2: [3, 4], // Tuesday: plates ending in 3, 4
      3: [5, 6], // Wednesday: plates ending in 5, 6
      4: [7, 8], // Thursday: plates ending in 7, 8
      5: [9, 0], // Friday: plates ending in 9, 0
    };

    const isRestrictedDay = restrictions[today]?.includes(lastDigit);
    const isRestrictedTime = (hour >= 6 && hour <= 9) || (hour >= 16 && hour <= 20);

    return {
      restricted: isRestrictedDay && isRestrictedTime,
      reason: isRestrictedDay && isRestrictedTime ? 'Pico y placa restriction' : null,
      lastDigit,
      day: today,
      hour
    };
  }
}