import { IsString, IsOptional, IsEnum, IsObject } from 'class-validator';

export enum NotificationType {
  PUSH = 'push',
  EMAIL = 'email',
  SMS = 'sms'
}

export class SendNotificationDto {
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  recipient: string; // FCM token, email, or phone number

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsObject()
  data?: any;

  @IsOptional()
  @IsString()
  templateId?: string;
}

export class BulkNotificationDto {
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString({ each: true })
  recipients: string[];

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsObject()
  data?: any;
}