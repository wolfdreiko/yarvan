import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SendNotificationDto, BulkNotificationDto } from './notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Post('send')
  sendNotification(@Body() dto: SendNotificationDto) {
    return this.notificationService.sendNotification(dto);
  }

  @Post('bulk')
  sendBulkNotification(@Body() dto: BulkNotificationDto) {
    return this.notificationService.sendBulkNotification(dto);
  }

  @Post('push')
  sendPushNotification(@Body() dto: Omit<SendNotificationDto, 'type'>) {
    return this.notificationService.sendPushNotification(dto.recipient, dto.title, dto.message, dto.data);
  }

  @Post('email')
  sendEmail(@Body() dto: Omit<SendNotificationDto, 'type'>) {
    return this.notificationService.sendEmail(dto.recipient, dto.title, dto.message);
  }

  @Post('sms')
  sendSMS(@Body() dto: Omit<SendNotificationDto, 'type'>) {
    return this.notificationService.sendSMS(dto.recipient, dto.message);
  }
}