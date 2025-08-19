import { IsEmail, IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { DriverStatus } from './driver.entity';

export class CreateDriverDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  phone: string;

  @IsString()
  licenseNumber: string;
}

export class UpdateDriverDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(DriverStatus)
  status?: DriverStatus;

  @IsOptional()
  @IsNumber()
  currentLat?: number;

  @IsOptional()
  @IsNumber()
  currentLng?: number;
}

export class CreateVehicleDto {
  @IsString()
  licensePlate: string;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsNumber()
  year: number;

  @IsString()
  color: string;

  @IsNumber()
  driverId: number;
}