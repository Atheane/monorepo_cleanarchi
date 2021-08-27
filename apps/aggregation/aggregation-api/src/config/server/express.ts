import { ExpressAppInsightsMiddleware } from '@oney/applicationinsights-enhanced';
import { initMongooseConnection } from '@oney/aggregation-adapters';
import { ConfigService } from '@oney/envs';
import * as bodyParser from 'body-parser';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import * as cors from 'cors';
import { Application } from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import { useExpressServer, useContainer, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as swaggerUi from 'swagger-ui-express';
import { Container } from 'inversify';
import { getAppConfiguration } from './envs/EnvConfiguration';
import { buildModules } from '../../modules';
import { AuthController } from '../../modules/auth/AuthController';
import { BankController } from '../../modules/bank/BankController';
import { BankConnectionController } from '../../modules/bankConnection/BankConnectionController';
import { HealthCheckController } from '../../modules/healthcheck/HealthCheckController';
import { UserController } from '../../modules/user/UserController';
import { AppKernel } from '../di/AppKernel';
import { buildMiddlewares } from '../../modules/middlewares';
import { CustomErrorMiddleware } from '../../modules/middlewares/CustomErrorMiddleware';
import { TermsController } from '../../modules/terms/TermsController';
import { DomainErrorMiddleware } from '../../modules/middlewares/DomainErrorMiddleware';
import { CreditProfileController } from '../../modules/creditProfile/CreditProfileController';

const prefix = '/aggregation';

export async function configureEnvs(envPath: string): Promise<void> {
  /* istanbul ignore next */ // We ignore this test case because we dont want to test app in Production mode.

  await new ConfigService({
    localUri: process.env.NODE_ENV === 'production' ? null : envPath,
    keyvaultUri: process.env.AUTH_KEY_VAULT_URI,
  }).loadEnv();
}

export async function configureApp(app: Application, envPath: string, inmemory: boolean): Promise<Container> {
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

  const container = await new AppKernel(envConfiguration).initAppDependencies(inmemory);

  if (!inmemory) {
    await initMongooseConnection(envConfiguration.mongoDBConfiguration.uri);
  }

  useContainer(container);
  buildModules(container);
  buildMiddlewares(container);
  return container;
}

function configureDocumentation(app: Application): void {
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
        title: 'Odb Aggregation Open Api documentation',
        version: '1.0.0',
      },
    },
  );
  app.use(`${prefix}/docs`, swaggerUi.serve);
  app.get(`${prefix}/docs`, swaggerUi.setup(spec));
}

export async function initRouter(app: Application): Promise<void> {
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
  app.use(cors());
  app.use(helmet());
  app.use(morgan('combined'));

  useExpressServer(app, {
    defaultErrorHandler: false,
    middlewares: [DomainErrorMiddleware, CustomErrorMiddleware],
    routePrefix: prefix,
    controllers: [
      HealthCheckController,
      BankController,
      AuthController,
      UserController,
      BankConnectionController,
      TermsController,
      CreditProfileController,
    ],
  });
  configureDocumentation(app);
}
