import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';
import { setupLogger } from './common/logger/logger.config';

async function bootstrap() {
  try {
    console.log('🔄 Starting backend server...');
    console.log('📋 Environment:', process.env.NODE_ENV || 'development');

    const app = await NestFactory.create(AppModule, {
      logger: setupLogger(),
      // Don't abort on database connection errors - let the app start
      abortOnError: false,
    });

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT') || 3000;
    const apiPrefix = configService.get<string>('API_PREFIX') || 'api';

    console.log('⚙️  Configuring middleware...');

    // Request logging middleware
    app.use((req: Request, res: Response, next: NextFunction) => {
      const start = Date.now();
      console.log(`📥 ${req.method} ${req.url} - ${req.ip || 'unknown'}`);
      res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`📤 ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
      });
      next();
    });

    // Security
    app.use(helmet());

    // CORS
    app.enableCors({
      origin: '*', // Configure for production
      credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // API prefix
    // app.setGlobalPrefix(apiPrefix);

    console.log('🌐 Starting HTTP server...');
    // Listen on all network interfaces (0.0.0.0) to allow access from emulators/devices
    await app.listen(port, '0.0.0.0');

    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ BACKEND SERVER STARTED SUCCESSFULLY');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`🚀 Local:      http://localhost:${port}/${apiPrefix}`);
    console.log(`📱 Emulator:   http://10.0.2.2:${port}/${apiPrefix}`);
    console.log(`🔍 Health:     http://localhost:${port}/${apiPrefix}/health`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('💡 Tip: Test the health endpoint in your browser first!');
    console.log('💡 Tip: If you see database errors, the app will retry automatically.');
    console.log('');
  } catch (error) {
    console.error('');
    console.error('═══════════════════════════════════════════════════════');
    console.error('❌ FAILED TO START BACKEND SERVER');
    console.error('═══════════════════════════════════════════════════════');
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Error:', errorMessage);
    if (errorStack) {
      console.error('Stack:', errorStack);
    }
    console.error('');
    console.error('🔧 Troubleshooting:');
    console.error('   1. Check if port 3000 is already in use');
    console.error('   2. Verify your .env file exists and is configured');
    console.error('   3. If using PostgreSQL, ensure the service is running');
    console.error('   4. Try using SQLite for local development (DB_TYPE=sqlite)');
    console.error('═══════════════════════════════════════════════════════');
    process.exit(1);
  }
}

bootstrap();
