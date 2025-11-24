// Log immediately to verify function is loading
console.log('🚀 API handler loading...', new Date().toISOString());

import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express, { Request, Response } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { setupLogger } from '../src/common/logger/logger.config';

console.log('✅ Imports loaded successfully');

let cachedApp: express.Application;
let isInitializing = false;
let initError: Error | null = null;

async function createApp(): Promise<express.Application> {
  if (cachedApp) {
    console.log('♻️ Using cached app');
    return cachedApp;
  }

  if (isInitializing) {
    console.log('⏳ Waiting for initialization...');
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
    console.log('🔄 Starting app initialization...');
    
    console.log('📱 Creating Express app...');
    const expressApp = express();
    const adapter = new ExpressAdapter(expressApp);

    console.log('🏗️ Creating NestJS app...');
    const app = await NestFactory.create(AppModule, adapter, {
      logger: setupLogger(),
    });
    console.log('✅ NestJS app created');

    console.log('⚙️ Configuring app...');
    const configService = app.get(ConfigService);
    
    // For Vercel: Don't set API prefix since Vercel already routes to /api
    // Setting it would cause /api/api/... URLs
    // Only set prefix if not in serverless environment
    if (!process.env.VERCEL) {
      const apiPrefix = configService.get<string>('API_PREFIX') || 'api';
      app.setGlobalPrefix(apiPrefix);
      console.log(`📌 API prefix set to: ${apiPrefix}`);
    } else {
      console.log('📌 Skipping API prefix (Vercel environment)');
    }

    // Security - configure helmet for serverless
    console.log('🔒 Configuring security...');
    app.use(helmet({
      contentSecurityPolicy: false, // Disable CSP for API
    }));

    // CORS
    console.log('🌐 Configuring CORS...');
    app.enableCors({
      origin: '*',
      credentials: true,
    });

    // Global validation pipe
    console.log('✅ Configuring validation...');
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
    console.log('🚀 Initializing NestJS app...');
    await app.init();
    console.log('✅ App initialized successfully!');

    cachedApp = expressApp;
    isInitializing = false;
    return expressApp;
  } catch (error) {
    isInitializing = false;
    initError = error instanceof Error ? error : new Error(String(error));
    console.error('❌ Failed to initialize NestJS app:', {
      message: initError.message,
      stack: initError.stack,
      name: initError.name,
    });
    throw initError;
  }
}

export default async function handler(req: Request, res: Response) {
  console.log('📥 Request received:', {
    method: req.method,
    url: req.url,
    path: req.path,
    timestamp: new Date().toISOString(),
  });

  try {
    const app = await createApp();
    console.log('✅ App ready, handling request...');
    return app(req, res);
  } catch (error) {
    console.error('❌ Error in serverless function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('📋 Error details:', {
      message: errorMessage,
      stack: errorStack,
      name: error instanceof Error ? error.name : 'Unknown',
      cause: error instanceof Error ? (error as any).cause : undefined,
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
