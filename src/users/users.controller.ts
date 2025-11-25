import { Controller, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RegisterFcmTokenDto } from './dto/register-fcm-token.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(':id/fcmToken')
  async registerFcmToken(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() registerFcmTokenDto: RegisterFcmTokenDto,
  ) {
    console.log(`📥 FCM Token registration request for user: ${id}`);
    if (user.id !== id) {
      throw new Error('Unauthorized');
    }
    try {
      const result = await this.usersService.registerFcmToken(
        id,
        registerFcmTokenDto.token,
        registerFcmTokenDto.platform,
      );
      console.log(`✅ FCM Token registered successfully for user: ${id}`);
      return result;
    } catch (error) {
      console.error(`❌ Error registering FCM token for user ${id}:`, error);
      throw error;
    }
  }

  @Delete(':id/fcmToken')
  async deleteFcmToken(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() body: { token: string },
  ) {
    if (user.id !== id) {
      throw new Error('Unauthorized');
    }
    await this.usersService.deleteFcmToken(id, body.token);
    return { success: true };
  }
}
