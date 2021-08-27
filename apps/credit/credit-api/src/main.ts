import 'reflect-metadata';
import 'applicationinsights';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExpressAppInsightsMiddleware } from '@oney/applicationinsights-enhanced';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { loadingEnvironmentConfig } from './config/env/EnvConfigurationService';
import { ValidationPipe } from './config/middlewares/ValidationPipe';
import { setupApp } from './config/Setup';
import { getAppConfiguration } from './config/app/AppConfigurationService';

const envPath = 'apps/credit/credit-api/local.env';

async function bootstrap(): Promise<void> {
  await loadingEnvironmentConfig(envPath);

  const configuration = getAppConfiguration();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const appInsightMiddleware = new ExpressAppInsightsMiddleware();
  if (configuration.appInsightConfiguration.use) {
    appInsightMiddleware
      .configure(app.getHttpAdapter() as any, {
        instrumentationKey: configuration.appInsightConfiguration.key,
        trackBodies: configuration.appInsightConfiguration.trackBodies,
        traceConsoleLogs: configuration.appInsightConfiguration.trackConsoleLogs,
      })
      .start();
  }

  await setupApp();

  app.setGlobalPrefix('credit');
  app.useGlobalPipes(new ValidationPipe());
  app.use(morgan('combined'));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(cors());
  app.use(helmet());

  const options = new DocumentBuilder()
    .setTitle('ODB GTCS API')
    .setDescription('GTCS endpoints api specifications')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('credit/docs', app, document);
  await app.listen(configuration.port);
}

bootstrap();
