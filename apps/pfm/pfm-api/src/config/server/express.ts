import { Application } from 'express';
import { useExpressServer, useContainer, getMetadataArgsStorage } from 'routing-controllers';
import * as bodyParser from 'body-parser';
import { ConfigService } from '@oney/envs';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { ExpressAppInsightsMiddleware } from '@oney/applicationinsights-enhanced';
import { initMongooseConnection } from '@oney/pfm-adapters';
import * as helmet from 'helmet';
import * as swaggerUi from 'swagger-ui-express';
import * as cors from 'cors';
import * as morgan from 'morgan';
import { getAppConfiguration } from './envs/EnvConfiguration';
import { HealthCheckController } from '../../modules/healthcheck/HealthCheckController';
import { AppKernel } from '../di/AppKernel';
import { buildModules } from '../../modules';
import { UserController } from '../../modules/users/UserController';
import { buildMiddlewares } from '../middlewares';
import { CustomErrorMiddleware } from '../middlewares/CustomErrorMiddleware';

const prefix = '/pfm';
export async function configureEnvs(envPath: string) {
  /* istanbul ignore next */ // We ignore this test case because we dont want to test app in Production mode.

  await new ConfigService({
    localUri: process.env.NODE_ENV === 'production' ? null : envPath,
    keyvaultUri: process.env.AUTH_KEY_VAULT_URI,
  }).loadEnv();
}

export async function configureApp(app: Application, envPath: string, dbConnectionString?: string) {
  await configureEnvs(envPath);
  const envConfiguration = getAppConfiguration();

  if (envConfiguration.appInsightConfiguration.isActive && envConfiguration.appInsightConfiguration.apiKey) {
    const appInsightMiddleware = new ExpressAppInsightsMiddleware();
    appInsightMiddleware
      .configure(app, {
        instrumentationKey: envConfiguration.appInsightConfiguration.apiKey,
        trackBodies: true,
        traceConsoleLogs: true,
      })
      .start();
  }

  const dbConnection = await initMongooseConnection(
    dbConnectionString || envConfiguration.vault.cosmosDbConnectionString,
  );
  const container = await new AppKernel(envConfiguration, dbConnection).initAppDependencies();

  useContainer(container);
  buildModules(container);
  buildMiddlewares(container);
  return container;
}

function configureDocumentation(app: Application) {
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
        title: 'ODB PFM API',
        version: '1.0.0',
        description: 'PFM endpoints api specifications',
      },
    },
  );
  app.use(`${prefix}/docs`, swaggerUi.serve);
  app.get(`${prefix}/docs`, swaggerUi.setup(spec));
}

export async function initRouter(app: Application) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors());
  app.use(helmet());
  app.use(morgan('combined'));

  useExpressServer(app, {
    defaultErrorHandler: false,
    middlewares: [CustomErrorMiddleware],
    routePrefix: prefix,
    controllers: [HealthCheckController, UserController],
  });
  configureDocumentation(app);
}
