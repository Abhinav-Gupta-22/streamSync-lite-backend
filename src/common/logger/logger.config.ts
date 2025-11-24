import { Logger } from '@nestjs/common';
import { LoggerService } from '@nestjs/common';
import pino from 'pino';
import { ConfigService } from '@nestjs/config';

export function setupLogger(): LoggerService {
  const configService = new ConfigService();
  const logLevel = configService.get<string>('logging.level') || 'info';

  const logger = pino({
    level: logLevel,
    transport:
      configService.get('NODE_ENV') === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
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
