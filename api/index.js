
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/src/app.module');
const { setupLogger } = require('./dist/src/common/logger/logger.config');
const { ValidationPipe } = require('@nestjs/common');
const helmet = require('helmet');

let cachedServer;

async function bootstrapServer() {
  const app = await NestFactory.create(AppModule, {
    logger: setupLogger(),
  });

  // Apply global middlewares
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // Set global prefix if needed
  app.setGlobalPrefix('api');

  // Initialize the application
  await app.init();

  // Create serverless handler
  const expressApp = app.getHttpAdapter().getInstance();
  return expressApp;
}

module.exports = async (req, res) => {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  return cachedServer(req, res);
};