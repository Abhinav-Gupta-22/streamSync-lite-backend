import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Video } from '../database/entities/video.entity';
import { Progress } from '../database/entities/progress.entity';
import { Favorite } from '../database/entities/favorite.entity';

@Injectable()
export class VideosService {
  private youtubeApiKey: string;
  private defaultChannelId: string;
  private cacheTtlMinutes: number;

  constructor(
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
    @InjectRepository(Progress)
    private progressRepository: Repository<Progress>,
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.youtubeApiKey = this.configService.get<string>('youtube.apiKey') || '';
    this.defaultChannelId = this.configService.get<string>('youtube.channelId') || '';
    this.cacheTtlMinutes = this.configService.get<number>('youtube.cacheTtlMinutes') || 10;
  }

  /**
   * Resolve channel handle (e.g., @Codevolution) or channel ID to actual channel ID
   */
  private async resolveChannelId(channelIdentifier: string): Promise<string> {
    // If it's already a channel ID (starts with UC), return as is
    if (channelIdentifier.startsWith('UC') && channelIdentifier.length === 24) {
      return channelIdentifier;
    }

    // If it's a channel handle (starts with @), resolve it
    if (channelIdentifier.startsWith('@')) {
      const handle = channelIdentifier.substring(1); // Remove @
      try {
        const response = await firstValueFrom(
          this.httpService.get('https://www.googleapis.com/youtube/v3/channels', {
            params: {
              part: 'id',
              forHandle: handle,
              key: this.youtubeApiKey,
            },
          }),
        );

        if (response.data.items && response.data.items.length > 0) {
          return response.data.items[0].id;
        }
      } catch (error) {
        console.error('Error resolving channel handle:', error);
        throw new Error(`Could not resolve channel handle: ${channelIdentifier}`);
      }
    }

    // Try as username (for older channel formats)
    try {
      const response = await firstValueFrom(
        this.httpService.get('https://www.googleapis.com/youtube/v3/channels', {
          params: {
            part: 'id',
            forUsername: channelIdentifier,
            key: this.youtubeApiKey,
          },
        }),
      );

      if (response.data.items && response.data.items.length > 0) {
        return response.data.items[0].id;
      }
    } catch (error) {
      // If it fails, assume it's already a channel ID
      return channelIdentifier;
    }

    return channelIdentifier;
  }

  async getLatestVideos(channelId?: string, limit: number = 10, userId?: string): Promise<any[]> {
    // Use provided channelId or default from config
    const targetChannelId = channelId || this.defaultChannelId;
    
    if (!targetChannelId) {
      throw new Error('No channel ID provided and no default channel configured');
    }

    // Resolve channel handle to channel ID if needed
    const resolvedChannelId = await this.resolveChannelId(targetChannelId);
    // Check cache first
    const cachedVideos = await this.videosRepository.find({
      where: { channelId: resolvedChannelId },
      order: { publishedAt: 'DESC' },
      take: limit,
    });

    const now = new Date();
    const cacheAgeMinutes =
      cachedVideos.length > 0
        ? (now.getTime() - cachedVideos[0].updatedAt.getTime()) / (1000 * 60)
        : Infinity;

    if (cacheAgeMinutes < this.cacheTtlMinutes && cachedVideos.length >= limit) {
      return cachedVideos;
    }

    // Fetch from YouTube API
    const response = await firstValueFrom(
      this.httpService.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          channelId: resolvedChannelId,
          maxResults: limit,
          order: 'date',
          type: 'video',
          key: this.youtubeApiKey,
        },
      }),
    );

    if (!response.data.items || response.data.items.length === 0) {
      return cachedVideos; // Return cached videos if no new videos found
    }

    const videoIds = response.data.items.map((item: any) => item.id.videoId).join(',');

    // Get video details
    const detailsResponse = await firstValueFrom(
      this.httpService.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'snippet,contentDetails',
          id: videoIds,
          key: this.youtubeApiKey,
        },
      }),
    );

    // Save to database
    const videos: Video[] = [];
    for (const item of detailsResponse.data.items) {
      const duration = this.parseDuration(item.contentDetails.duration);
      const video = await this.videosRepository.save({
        videoId: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        channelId: item.snippet.channelId,
        publishedAt: new Date(item.snippet.publishedAt),
        durationSeconds: duration,
      });
      videos.push(video);
    }

    const finalVideos = videos.length > 0 ? videos : cachedVideos;

    // If user is authenticated, include favorite status
    if (userId) {
      const videoIds = finalVideos.map(v => v.videoId);
      const favorites = videoIds.length > 0
        ? await this.favoritesRepository.find({
            where: {
              userId,
              videoId: In(videoIds),
            },
          })
        : [];
      const favoriteVideoIds = new Set(favorites.map(f => f.videoId));

      return finalVideos.map(video => ({
        videoId: video.videoId,
        title: video.title,
        description: video.description,
        thumbnailUrl: video.thumbnailUrl,
        channelId: video.channelId,
        publishedAt: video.publishedAt,
        durationSeconds: video.durationSeconds,
        isFavorite: favoriteVideoIds.has(video.videoId),
      }));
    }

    // Return without favorite status if user is not authenticated
    return finalVideos.map(video => ({
      videoId: video.videoId,
      title: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      channelId: video.channelId,
      publishedAt: video.publishedAt,
      durationSeconds: video.durationSeconds,
      isFavorite: false,
    }));
  }

  async getVideoById(videoId: string): Promise<Video | null> {
    return this.videosRepository.findOne({ where: { videoId } });
  }

  async saveProgress(
    userId: string,
    videoId: string,
    positionSeconds: number,
    completedPercent: number,
  ): Promise<Progress> {
    const progress = await this.progressRepository.findOne({
      where: { userId, videoId },
    });

    if (progress) {
      progress.positionSeconds = positionSeconds;
      progress.completedPercent = completedPercent;
      progress.synced = false;
      return this.progressRepository.save(progress);
    }

    const newProgress = this.progressRepository.create({
      userId,
      videoId,
      positionSeconds,
      completedPercent,
      synced: false,
    });
    return this.progressRepository.save(newProgress);
  }

  async toggleFavorite(userId: string, videoId: string): Promise<{ favorited: boolean }> {
    const favorite = await this.favoritesRepository.findOne({
      where: { userId, videoId },
    });

    if (favorite) {
      await this.favoritesRepository.remove(favorite);
      return { favorited: false };
    }

    await this.favoritesRepository.save({
      userId,
      videoId,
      synced: false,
    });
    return { favorited: true };
  }

  private parseDuration(duration: string): number {
    // Parse ISO 8601 duration (PT1H2M3S) to seconds
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseInt(match[3] || '0', 10);
    return hours * 3600 + minutes * 60 + seconds;
  }
}
