import { defaultLogger } from '@oney/logger-adapters';
import * as appInsights from 'applicationinsights';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import * as cors from 'cors';
import * as express from 'express';
import { Application } from 'express';
import * as useragent from 'express-useragent';
import * as helmet from 'helmet';
import errorLib from 'odb-errors';
import { getMetadataArgsStorage, useContainer, useExpressServer } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as swaggerUi from 'swagger-ui-express';
import { Container } from 'inversify';
import { HealthCheckController } from '../../api/health/health.controller';
import { PreferencesController } from '../../api/preferences/preferences.controller';
import { Kernel } from '../../di';
import { setupKernel } from '../../di/config.kernel';
import { MongoDBConfiguration } from '../../domain/config/types/MongoDBConfiguration';
import { ServiceBusConfiguration } from '../../domain/config/types/ServiceBusConfiguration';
import { CustomErrorHandler } from '../../middlewares/CustomErrorHandler';
import { configureContextIdMiddleware } from '../../middlewares/contextId.middleware';
import * as db from '../database';
import { buildModules } from '../../api';
import { buildMiddlewares } from '../../api/middlewares';

/**
 * Function to place every configuration for the service
 * @param {Application} app The express Application
 */
export function configureApp(app) {
  app.use(express.json());
  app.use(express.urlencoded());

  app.use(helmet());
  app.use(useragent.express());
  app.use(cors());
  configureContextIdMiddleware(app);
}

/**
 * Function to place every error function management
 * @param {Application} app The express Application
 */
export function configureError(app, appMetadata, jwtSecret) {
  // -- !!! Error Lib Setup
  errorLib.setup({
    serviceId: appMetadata.id,
    logger: defaultLogger,
    secret: jwtSecret,
  });

  // -- Error middlewares (generic)
  app.use(errorLib.errorMiddlewares(['input', 'generic', 'database']));
}

/**
 * Function to configure database
 */
export async function configureDatabase(dbConfiguration: MongoDBConfiguration) {
  defaultLogger.info(`Setting up database ...`);
  await db.connect(dbConfiguration);
}

function configureDocumentation(app: Application, prefix: string) {
  const schemas = validationMetadatasToSchemas({
    refPointerPrefix: '#/components/schemas/',
  });
  const storage = getMetadataArgsStorage();
  const spec = routingControllersToSpec(
    storage,
    {},
    {
      routePrefix: prefix,
      components: { schemas },
      info: {
        title: 'Odb Notifications Open Api documentation',
        version: '1.0.0',
      },
    },
  );
  app.use(`${prefix}/docs`, swaggerUi.serve);
  app.get(`${prefix}/docs`, swaggerUi.setup(spec));
}

export function configureRouter(app): void {
  const prefix = '/notifications';

  defaultLogger.info(`Setting up api documentation to path : ${prefix}/docs ...`);
  configureDocumentation(app, prefix);

  defaultLogger.info(`Setting up router ...`);
  useExpressServer(app, {
    defaultErrorHandler: false,
    middlewares: [CustomErrorHandler],
    routePrefix: prefix,
    controllers: [HealthCheckController, PreferencesController],
  });
}

export async function configureEventDispatcher(
  serviceBusConfig: ServiceBusConfiguration,
  inmemory = false,
): Promise<Kernel> {
  defaultLogger.info(`Setting up kernel ...`);
  const kernel = await setupKernel(serviceBusConfig, inmemory);

  await kernel.initSubscribers();

  return kernel;
}

export const configureAppInsight = (app, appInsightConfig) => {
  if (appInsightConfig.isActive && appInsightConfig.apiKey) {
    defaultLogger.info('App insight is activated');
    appInsights
      .setup(appInsightConfig.apiKey)
      .setAutoDependencyCorrelation(true)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true, true)
      .setAutoCollectExceptions(true)
      .setAutoCollectDependencies(true)
      .setAutoCollectConsole(true, true)
      .setUseDiskRetryCaching(true)
      .setSendLiveMetrics(true)
      // .setInternalLogging(true, true)
      .setDistributedTracingMode(appInsights.DistributedTracingModes.AI)
      .start();
    const client = appInsights.defaultClient;
    app.use((req, res, next) => {
      // Let's try to track all http requests
      client.trackNodeHttpRequest({ request: req, response: res });
      next();
    });
  }
};

export function buildAppKernel(container: Container): void {
  useContainer(container);
  buildModules(container);
  buildMiddlewares(container);
}
