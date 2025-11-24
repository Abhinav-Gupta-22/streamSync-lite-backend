import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const dbType = this.configService.get('database.type') || 'sqlite';
    const nodeEnv = this.configService.get('NODE_ENV') || 'development';

    // SQLite configuration (for local development)
    if (dbType === 'sqlite') {
      return {
        type: 'better-sqlite3',
        database: this.configService.get<string>('database.database') || join(process.cwd(), 'database.sqlite'),
        entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
        migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],
        synchronize: nodeEnv === 'development',
        logging: nodeEnv === 'development',
        retryAttempts: 0, // SQLite doesn't need retries
      };
    }

    // PostgreSQL configuration (for production, Docker, or free tier cloud services)
    const sslEnabled = this.configService.get<string>('database.ssl') === 'true';
    
    return {
      type: 'postgres',
      host: this.configService.get<string>('database.host') || 'localhost',
      port: this.configService.get<number>('database.port') || 5432,
      username: this.configService.get<string>('database.username') || '',
      password: this.configService.get<string>('database.password') || '',
      database: this.configService.get<string>('database.database') || '',
      entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
      migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],
      synchronize: nodeEnv === 'development',
      logging: nodeEnv === 'development',
      retryAttempts: 3,
      retryDelay: 3000,
      // SSL configuration for cloud databases (Supabase, Neon, Railway, etc.)
      ssl: sslEnabled ? {
        rejectUnauthorized: false, // Set to true in production with proper certificates
      } : false,
    };
  }
}
