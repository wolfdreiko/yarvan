import { IsString, IsEnum, IsArray, IsBoolean, IsOptional, IsNumber } from 'class-validator';
import { GeofenceType } from './geofence.entity';

export class CreateGeofenceDto {
  @IsString()
  name: string;

  @IsEnum(GeofenceType)
  type: GeofenceType;

  @IsArray()
  polygon: { lat: number; lng: number }[];

  @IsOptional()
  @IsString()
  restrictions?: string;
}

export class UpdateGeofenceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  polygon?: { lat: number; lng: number }[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  restrictions?: string;
}

export class CheckLocationDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsOptional()
  @IsString()
  licensePlate?: string;
}