import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SendTestNotificationDto } from './dto/send-test-notification.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getUserNotifications(
    @CurrentUser() user: any,
    @Query('limit') limit?: string,
    @Query('since') since?: string,
  ) {
    return this.notificationsService.getUserNotifications(
      user.id,
      limit ? parseInt(limit, 10) : 50,
      since ? new Date(since) : undefined,
    );
  }

  @Post('mark-read')
  async markAsRead(@CurrentUser() user: any, @Body() body: { notificationId: string }) {
    await this.notificationsService.markAsRead(body.notificationId, user.id);
    return { success: true };
  }

  @Delete(':id')
  async deleteNotification(@CurrentUser() user: any, @Param('id') id: string) {
    await this.notificationsService.deleteNotification(id, user.id);
    return { success: true };
  }

  @Throttle({ default: { limit: 5, ttl: 3600000 } })
  @Post('send-test')
  async sendTestNotification(
    @CurrentUser() user: any,
    @Body() sendTestNotificationDto: SendTestNotificationDto,
  ) {
    return this.notificationsService.sendTestNotification(
      user.id,
      sendTestNotificationDto.title,
      sendTestNotificationDto.body,
    );
  }
}
