import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { FcmToken } from '../database/entities/fcm-token.entity';
import { RegisterDto } from '../auth/dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(FcmToken)
    private fcmTokensRepository: Repository<FcmToken>,
  ) {}

  async create(registerDto: RegisterDto): Promise<User> {
    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    const user = this.usersRepository.create({
      email: registerDto.email,
      name: registerDto.name,
      passwordHash,
    });
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async registerFcmToken(userId: string, token: string, platform: string): Promise<FcmToken> {
    try {
      // Check if repository is connected (quick check)
      if (!this.fcmTokensRepository.manager.connection?.isInitialized) {
        console.error('❌ Database connection not initialized');
        throw new Error('Database connection not available. Please check your database configuration.');
      }

      // Check if token already exists with timeout
      const existingToken = await Promise.race([
        this.fcmTokensRepository.findOne({
          where: { token },
        }),
        new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('Database query timeout')), 10000),
        ),
      ]) as FcmToken | null;

      if (existingToken) {
        // Update existing token if user changed
        if (existingToken.userId !== userId) {
          existingToken.userId = userId;
          existingToken.platform = platform;
          return this.fcmTokensRepository.save(existingToken);
        }
        return existingToken;
      }

      // Create new token
      const fcmToken = this.fcmTokensRepository.create({
        userId,
        token,
        platform,
      });
      return this.fcmTokensRepository.save(fcmToken);
    } catch (error) {
      console.error('❌ Database error in registerFcmToken:', error);
      // Re-throw with more context
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('timeout') || errorMessage.includes('ECONNREFUSED') || errorMessage.includes('not available')) {
        throw new Error('Database connection failed. Please check if your database server is running and configured correctly.');
      }
      throw new Error(`Failed to register FCM token: ${errorMessage}`);
    }
  }

  async deleteFcmToken(userId: string, token: string): Promise<void> {
    await this.fcmTokensRepository.delete({ userId, token });
  }

  async getUserFcmTokens(userId: string): Promise<FcmToken[]> {
    return this.fcmTokensRepository.find({ where: { userId } });
  }

  async updateProfile(userId: string, name: string, email?: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.name = name;
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await this.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException('Email already in use');
      }
      user.email = email;
    }

    return this.usersRepository.save(user);
  }
}
