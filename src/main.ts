import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { setupSwagger } from './util/swagger-setup';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  const logger = new Logger('Bootstrap');

  setupSwagger(app);

  await app.listen(
    configService.getOrThrow('APP_PORT'),
    configService.getOrThrow('APP_HOST'),
  );

  logger.log(`Application is running on: ${await app.getUrl()}`);
  logger.debug(`Swagger is running on: ${await app.getUrl()}/api`);
}
bootstrap();
