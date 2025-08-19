import { IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';
import { TripStatus } from './trip.entity';

export class CreateTripDto {
  @IsNumber()
  passengerId: number;

  @IsNumber()
  originLat: number;

  @IsNumber()
  originLng: number;

  @IsString()
  originAddress: string;

  @IsNumber()
  destinationLat: number;

  @IsNumber()
  destinationLng: number;

  @IsString()
  destinationAddress: string;
}

export class UpdateTripDto {
  @IsOptional()
  @IsNumber()
  driverId?: number;

  @IsOptional()
  @IsEnum(TripStatus)
  status?: TripStatus;

  @IsOptional()
  @IsNumber()
  fare?: number;

  @IsOptional()
  @IsNumber()
  distance?: number;
}