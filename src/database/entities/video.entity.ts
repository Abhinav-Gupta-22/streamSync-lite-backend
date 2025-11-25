import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Progress } from './progress.entity';
import { Favorite } from './favorite.entity';

@Entity('videos')
export class Video {
  @PrimaryColumn({ name: 'video_id' })
  videoId: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ name: 'thumbnail_url' })
  thumbnailUrl: string;

  @Column({ name: 'channel_id' })
  channelId: string;

  @Column({ name: 'published_at', type: 'timestamptz' })
  publishedAt: Date;

  @Column({ name: 'duration_seconds', nullable: true })
  durationSeconds: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Progress, progress => progress.video)
  progress: Progress[];

  @OneToMany(() => Favorite, favorite => favorite.video)
  favorites: Favorite[];
}
