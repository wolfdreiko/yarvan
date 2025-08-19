import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export enum UserRole {
  PASSENGER = 'passenger',
  DRIVER = 'driver',
  ADMIN = 'admin'
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}