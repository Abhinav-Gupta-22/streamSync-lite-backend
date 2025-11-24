import { Logger } from '@nestjs/common';
import { LoggerService } from '@nestjs/common';
import pino from 'pino';
import { ConfigService } from '@nestjs/config';

export function setupLogger(): LoggerService {
  const configService = new ConfigService();
  const logLevel = configService.get<string>('logging.level') || 'info';
  const nodeEnv = configService.get('NODE_ENV') || process.env.NODE_ENV || 'development';
  const isVercel = !!process.env.VERCEL;
  const isDevelopment = nodeEnv === 'development' && !isVercel;

  // In serverless environments (Vercel), don't use pino-pretty
  // Use simple JSON logging instead
  const logger = pino({
    level: logLevel,
    ...(isDevelopment
      ? {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          },
        }
      : {
          // Production/serverless: use simple JSON format
          formatters: {
            level: (label) => {
              return { level: label };
            },
          },
        }),
  });

  return {
    log(message: any, context?: string) {
      logger.info({ context }, message);
    },
    error(message: any, trace?: string, context?: string) {
      logger.error({ context, trace }, message);
    },
    warn(message: any, context?: string) {
      logger.warn({ context }, message);
    },
    debug(message: any, context?: string) {
      logger.debug({ context }, message);
    },
    verbose(message: any, context?: string) {
      logger.trace({ context }, message);
    },
  };
}
