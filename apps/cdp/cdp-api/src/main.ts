import 'reflect-metadata';
import 'applicationinsights';
import { SetupEventHandlers } from './app/event-handlers/Setup';
import { setupConfiguration } from './configuration/Setup';
import { SetupContainer } from './container/Setup';
import { SetupLogger } from './logger/Setup';
import { ExpressCDP } from './server/express';

const envPath = 'apps/cdp/cdp-api/local.env';

async function bootstrap() {
  const config = await setupConfiguration(envPath);

  const container = SetupContainer(config);

  const express = container.resolve(ExpressCDP);

  express.configureAppInsights();

  const logger = SetupLogger(container);

  await SetupEventHandlers(container);

  express.initialize(container);
  express.configureRoutes();
  express.start();
}

bootstrap().then(() => {
  console.log(`Application started !`);
});
