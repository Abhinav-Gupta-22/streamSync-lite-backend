import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { Video } from '../database/entities/video.entity';
import { Progress } from '../database/entities/progress.entity';
import { Favorite } from '../database/entities/favorite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Video, Progress, Favorite]), HttpModule],
  controllers: [VideosController],
  providers: [VideosService],
  exports: [VideosService],
})
export class VideosModule {}
