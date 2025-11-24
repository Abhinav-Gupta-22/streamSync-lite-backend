import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { Notification } from '../database/entities/notification.entity';
import {
  NotificationJob,
  NotificationJobStatus,
} from '../database/entities/notification-job.entity';
import { FcmToken } from '../database/entities/fcm-token.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class NotificationsService {
  private firebaseApp: admin.app.App | null = null;

  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    @InjectRepository(NotificationJob)
    private notificationJobsRepository: Repository<NotificationJob>,
    @InjectRepository(FcmToken)
    private fcmTokensRepository: Repository<FcmToken>,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    // Initialize Firebase Admin SDK
    this.initializeFirebase();
  }

  private initializeFirebase() {
    if (admin.apps.length === 0) {
      try {
        const projectId = this.configService.get('firebase.projectId');
        const privateKey = this.configService.get('firebase.privateKey');
        const clientEmail = this.configService.get('firebase.clientEmail');

        if (!projectId || !privateKey || !clientEmail) {
          console.warn('Firebase credentials not configured. Push notifications will not work.');
          return;
        }

        this.firebaseApp = admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            privateKey,
            clientEmail,
          }),
        });
      } catch (error) {
        console.error('Failed to initialize Firebase Admin SDK:', error);
      }
    } else {
      this.firebaseApp = admin.apps[0] as admin.app.App;
    }
  }

  async createNotification(
    userId: string,
    title: string,
    body: string,
    metadata?: Record<string, any>,
  ): Promise<Notification> {
    const notification = this.notificationsRepository.create({
      userId,
      title,
      body,
      metadata,
    });
    return this.notificationsRepository.save(notification);
  }

  async sendTestNotification(userId: string, title: string, body: string): Promise<Notification> {
    const notification = await this.createNotification(userId, title, body, {
      type: 'test',
      source: 'user_test',
    });

    // Create notification job
    const job = this.notificationJobsRepository.create({
      notificationId: notification.id,
      status: NotificationJobStatus.PENDING,
    });
    await this.notificationJobsRepository.save(job);

    // Process immediately
    await this.processNotificationJob(job.id);

    return notification;
  }

  async getUserNotifications(
    userId: string,
    limit: number = 50,
    since?: Date,
  ): Promise<Notification[]> {
    const queryBuilder = this.notificationsRepository
      .createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId })
      .andWhere('notification.isDeleted = :isDeleted', { isDeleted: false })
      .orderBy('notification.createdAt', 'DESC')
      .limit(limit);

    if (since) {
      queryBuilder.andWhere('notification.createdAt > :since', { since });
    }

    return queryBuilder.getMany();
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    await this.notificationsRepository.update({ id: notificationId, userId }, { isRead: true });
  }

  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    await this.notificationsRepository.update({ id: notificationId, userId }, { isDeleted: true });
  }

  async processNotificationJob(jobId: string): Promise<void> {
    const job = await this.notificationJobsRepository.findOne({
      where: { id: jobId },
      relations: ['notification'],
    });

    if (!job || job.status !== NotificationJobStatus.PENDING) {
      return;
    }

    // Mark as processing
    job.status = NotificationJobStatus.PROCESSING;
    job.processingAt = new Date();
    await this.notificationJobsRepository.save(job);

    try {
      const notification = await this.notificationsRepository.findOne({
        where: { id: job.notificationId },
      });

      if (!notification) {
        throw new Error('Notification not found');
      }

      // Get user's FCM tokens
      const tokens = await this.fcmTokensRepository.find({
        where: { userId: notification.userId },
      });

      if (tokens.length === 0) {
        throw new Error('No FCM tokens found for user');
      }

      if (!this.firebaseApp) {
        throw new Error('Firebase not initialized');
      }

      // Send push notification
      const message = {
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: {
          notificationId: notification.id,
          type: notification.metadata?.type || 'general',
          ...Object.fromEntries(
            Object.entries(notification.metadata || {}).map(([k, v]) => [k, String(v)]),
          ),
        },
        tokens: tokens.map(t => t.token),
      };

      const response = await admin.messaging().sendEachForMulticast(message);

      // Update notification
      notification.sent = true;
      notification.receivedAt = new Date();
      await this.notificationsRepository.save(notification);

      // Update job
      job.status = NotificationJobStatus.SENT;
      job.messageId = response.responses[0]?.messageId || 'batch';
      await this.notificationJobsRepository.save(job);
    } catch (error: any) {
      job.retries += 1;
      job.lastError = error.message || 'Unknown error';

      if (job.retries >= 5) {
        job.status = NotificationJobStatus.DLQ;
      } else {
        job.status = NotificationJobStatus.PENDING;
      }

      await this.notificationJobsRepository.save(job);
    }
  }
}
