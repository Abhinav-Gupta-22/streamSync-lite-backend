import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express, { Request, Response } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { setupLogger } from '../src/common/logger/logger.config';

let cachedApp: express.Application;
let isInitializing = false;
let initError: Error | null = null;

async function createApp(): Promise<express.Application> {
  if (cachedApp) {
    return cachedApp;
  }

  if (isInitializing) {
    // Wait for initialization to complete
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (initError) {
      throw initError;
    }
    if (cachedApp) {
      return cachedApp;
    }
  }

  isInitializing = true;
  initError = null;

  try {
    const expressApp = express();
    const adapter = new ExpressAdapter(expressApp);

    const app = await NestFactory.create(AppModule, adapter, {
      logger: setupLogger(),
    });

    const configService = app.get(ConfigService);
    // For Vercel: Don't set API prefix since Vercel already routes to /api
    // Setting it would cause /api/api/... URLs
    // Only set prefix if not in serverless environment
    if (!process.env.VERCEL) {
      const apiPrefix = configService.get<string>('API_PREFIX') || 'api';
      app.setGlobalPrefix(apiPrefix);
    }

    // Security - configure helmet for serverless
    app.use(helmet({
      contentSecurityPolicy: false, // Disable CSP for API
    }));

    // CORS
    app.enableCors({
      origin: '*',
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

    // Initialize the app
    await app.init();

    cachedApp = expressApp;
    isInitializing = false;
    return expressApp;
  } catch (error) {
    isInitializing = false;
    initError = error instanceof Error ? error : new Error(String(error));
    console.error('Failed to initialize NestJS app:', initError);
    throw initError;
  }
}

export default async function handler(req: Request, res: Response) {
  try {
    const app = await createApp();
    return app(req, res);
  } catch (error) {
    console.error('Error in serverless function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
      name: error instanceof Error ? error.name : 'Unknown',
    });

    if (!res.headersSent) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: errorMessage,
        // Include stack in development for debugging
        ...(process.env.NODE_ENV !== 'production' && { stack: errorStack }),
      });
    }
  }
}

