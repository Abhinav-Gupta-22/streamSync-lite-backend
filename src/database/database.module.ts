import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Video } from './entities/video.entity';
import { Progress } from './entities/progress.entity';
import { Favorite } from './entities/favorite.entity';
import { Notification } from './entities/notification.entity';
import { NotificationJob } from './entities/notification-job.entity';
import { FcmToken } from './entities/fcm-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Video,
      Progress,
      Favorite,
      Notification,
      NotificationJob,
      FcmToken,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
