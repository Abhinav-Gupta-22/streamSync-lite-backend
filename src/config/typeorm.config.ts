import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const dbType = this.configService.get('database.type') || 'postgres';
    const nodeEnv = this.configService.get('NODE_ENV') || process.env.NODE_ENV || 'development';
    const isVercel = !!process.env.VERCEL;

    // SQLite configuration (for local development only - not for Vercel)
    if (dbType === 'sqlite' && !isVercel) {
      return {
        type: 'better-sqlite3',
        database:
          this.configService.get<string>('database.database') ||
          join(process.cwd(), 'database.sqlite'),
        entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
        migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],
        synchronize: nodeEnv === 'development',
        logging: nodeEnv === 'development',
        retryAttempts: 0, // SQLite doesn't need retries
      };
    }

    // PostgreSQL configuration (for production, Docker, or free tier cloud services)
    const sslEnabled = this.configService.get<string>('database.ssl') === 'true';
    const host = this.configService.get<string>('database.host');
    const username = this.configService.get<string>('database.username');
    const password = this.configService.get<string>('database.password');
    const database = this.configService.get<string>('database.database');

    // Validate required PostgreSQL connection parameters
    if (!host || !username || !password || !database) {
      console.error('❌ Missing required database environment variables:');
      console.error('  DB_HOST:', host ? '✓' : '✗ MISSING');
      console.error('  DB_USERNAME:', username ? '✓' : '✗ MISSING');
      console.error('  DB_PASSWORD:', password ? '✓' : '✗ MISSING');
      console.error('  DB_DATABASE:', database ? '✓' : '✗ MISSING');
      throw new Error(
        'Missing required database configuration. Please set DB_HOST, DB_USERNAME, DB_PASSWORD, and DB_DATABASE environment variables.',
      );
    }

    return {
      type: 'postgres',
      host,
      port: this.configService.get<number>('database.port') || 5432,
      username,
      password,
      database,
      entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
      migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],
      synchronize: false, // Never use synchronize in production/serverless
      logging: nodeEnv === 'development' && !isVercel,
      retryAttempts: 3,
      retryDelay: 3000,
      connectTimeoutMS: 10000, // 10 second timeout
      // SSL configuration for cloud databases (Supabase, Neon, Railway, etc.)
      ssl: sslEnabled
        ? {
            rejectUnauthorized: false, // Set to true in production with proper certificates
          }
        : false,
      // Don't fail on connection errors during app initialization
      // Let the app start and handle DB errors gracefully
      extra: {
        max: 10, // Maximum pool size
        connectionTimeoutMillis: 10000,
      },
    };
  }
}
