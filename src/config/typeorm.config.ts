import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const nodeEnv = this.configService.get('NODE_ENV') || process.env.NODE_ENV || 'development';
    const isVercel = !!process.env.VERCEL;

    // Check if synchronize is explicitly enabled via environment variable
    // Default to false for safety (prevents schema conflicts)
    const dbSync = this.configService.get<string>('database.sync') || process.env.DB_SYNC;
    const synchronizeEnabled = dbSync === 'true' || dbSync === '1';

    // PostgreSQL configuration (required for all environments)
    const sslEnabled = this.configService.get<string>('database.ssl') === 'true';
    const databaseUrl = this.configService.get<string>('database.url') || process.env.DATABASE_URL;
    const hasConnectionUrl = !!databaseUrl;
    const host = this.configService.get<string>('database.host');
    const port = this.configService.get<number>('database.port') || 5432;
    const username = this.configService.get<string>('database.username');
    const password = this.configService.get<string>('database.password');
    const database = this.configService.get<string>('database.database');

    // Validate required PostgreSQL connection parameters
    if (!hasConnectionUrl && (!host || !username || !password || !database)) {
      console.error('❌ Missing required database environment variables:');
      console.error('  DB_HOST:', host ? '✓' : '✗ MISSING');
      console.error('  DB_USERNAME:', username ? '✓' : '✗ MISSING');
      console.error('  DB_PASSWORD:', password ? '✓' : '✗ MISSING');
      console.error('  DB_DATABASE:', database ? '✓' : '✗ MISSING');
      throw new Error(
        'Missing required database configuration. Please set DB_HOST, DB_USERNAME, DB_PASSWORD, and DB_DATABASE environment variables.',
      );
    }

    // Determine if synchronize should be enabled
    // Default to FALSE for safety (prevents schema conflicts)
    // Only enable if explicitly set via DB_SYNC=true AND not on Vercel
    const shouldSynchronize = !isVercel && synchronizeEnabled;

    if (shouldSynchronize) {
      console.warn(
        '⚠️  WARNING: Database synchronize is ENABLED. This will auto-modify your database schema.',
      );
      console.warn('   If you see schema errors, set DB_SYNC=false in your .env file.');
    } else {
      console.log('✅ Database synchronize is DISABLED (safer for production).');
      console.log('   To enable: Set DB_SYNC=true in your .env file.');
    }

    const connectionOverrides = hasConnectionUrl
      ? { url: databaseUrl }
      : {
          host,
          port,
          username,
          password,
          database,
        };

    return {
      type: 'postgres',
      ...connectionOverrides,
      entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
      migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],
      synchronize: shouldSynchronize, // Only enable if explicitly requested
      logging: nodeEnv === 'development' && !isVercel,
      retryAttempts: 5, // Increased retry attempts
      retryDelay: 2000, // 2 second delay between retries
      // SSL configuration for cloud databases (Supabase, Neon, Railway, etc.)
      ssl: sslEnabled
        ? {
            rejectUnauthorized: false, // Set to true in production with proper certificates
          }
        : false,
      // Connection pool configuration for better reliability
      extra: {
        max: 10, // Maximum pool size
        connectionTimeoutMillis: 15000, // 15 second timeout (increased from 10s)
        idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
        // Reconnect on connection loss
        keepAlive: true,
        keepAliveInitialDelayMillis: 10000,
        // Statement timeout (30 seconds)
        statement_timeout: 30000,
      },
      // Don't fail app startup if database connection fails
      // This allows the server to start even if DB is temporarily unavailable
      // The app will retry connections when needed
      autoLoadEntities: true,
    };
  }
}
