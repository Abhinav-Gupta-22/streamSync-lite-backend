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
    if (user.id !== id) {
      throw new Error('Unauthorized');
    }
    return this.usersService.registerFcmToken(
      id,
      registerFcmTokenDto.token,
      registerFcmTokenDto.platform,
    );
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
