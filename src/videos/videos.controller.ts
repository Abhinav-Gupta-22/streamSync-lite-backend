import { Controller, Get, Post, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { VideosService } from './videos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SaveProgressDto } from './dto/save-progress.dto';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get('latest')
  @UseGuards(OptionalJwtAuthGuard)
  async getLatestVideos(
    @Request() req: any,
    @Query('channelId') channelId?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = req.user?.id;
    const videos = await this.videosService.getLatestVideos(channelId, limit ? parseInt(limit, 10) : 10, userId);
    // Return videos as array (frontend expects array format)
    return videos;
  }

  @Get(':videoId')
  async getVideoById(@Param('videoId') videoId: string) {
    return this.videosService.getVideoById(videoId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('progress')
  async saveProgress(@CurrentUser() user: any, @Body() saveProgressDto: SaveProgressDto) {
    return this.videosService.saveProgress(
      user.id,
      saveProgressDto.videoId,
      saveProgressDto.positionSeconds,
      saveProgressDto.completedPercent,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post(':videoId/favorite')
  async toggleFavorite(@CurrentUser() user: any, @Param('videoId') videoId: string) {
    return this.videosService.toggleFavorite(user.id, videoId);
  }
}
