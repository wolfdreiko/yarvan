import { IsNumber, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateComplianceDto {
  @IsNumber()
  vehicleId: number;

  @IsString()
  licensePlate: string;

  @IsOptional()
  @IsDateString()
  matriculaExpiryDate?: string;

  @IsOptional()
  @IsDateString()
  revisionExpiryDate?: string;

  @IsOptional()
  @IsDateString()
  soatExpiryDate?: string;
}

export class UpdateComplianceDto {
  @IsOptional()
  @IsDateString()
  matriculaExpiryDate?: string;

  @IsOptional()
  @IsDateString()
  revisionExpiryDate?: string;

  @IsOptional()
  @IsDateString()
  soatExpiryDate?: string;
}

export class CheckPlateDto {
  @IsString()
  licensePlate: string;
}