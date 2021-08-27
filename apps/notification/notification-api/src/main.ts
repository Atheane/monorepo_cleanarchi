import 'reflect-metadata';
import 'applicationinsights';
import { ConfigService } from '@oney/env';
import { configureLogger, defaultLogger } from '@oney/logger-adapters';
import * as express from 'express';
import request from 'request-promise-native';
import * as path from 'path';
import { Configuration } from './app/config/config.env';
import {
  buildAppKernel,
  configureApp,
  configureAppInsight,
  configureDatabase,
  configureError,
  configureEventDispatcher,
  configureRouter,
} from './app/services/server';
import start from './app/worker';

async function loadingEnvironmentConfig() {
  const useSystemEnv = ['production'];
  const isRunningInLocalEnvironment = !useSystemEnv.includes(process.env.NODE_ENV);
  await new ConfigService({
    localUri: isRunningInLocalEnvironment ? path.resolve(__dirname + '/local.env') : null,
    keyvaultUri: process.env.AUTH_KEY_VAULT_URI,
  }).loadEnv();
}

function activateRequestDebugMode(loggerLevel) {
  if (loggerLevel === 'trace') {
    request.debug = true;
  }
}

async function bootstrap() {
  await loadingEnvironmentConfig();
  const config = new Configuration();

  activateRequestDebugMode(config.loggerLevel);

  await configureDatabase(config.mongoDBConfiguration);

  const kernelContainer = await configureEventDispatcher(config.serviceBusConfiguration);

  configureLogger(kernelContainer);

  buildAppKernel(kernelContainer);
  const app = express();
  configureAppInsight(app, config.appInsightConfiguration);
  configureApp(app);
  configureRouter(app);
  configureError(app, config.appInfo, config.secrets.jwtSecret);
  app.listen(config.port, async () => {
    defaultLogger.warn(`Logger level : ${config.loggerLevel}`);
    defaultLogger.info(`[ODB_NOTIFICATION] listening on port ${config.port}!`);
    await start();
  });
}

bootstrap();
