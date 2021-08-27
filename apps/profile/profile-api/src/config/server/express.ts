import { ExpressAppInsightsMiddleware } from '@oney/applicationinsights-enhanced';
import { ConfigService } from '@oney/envs';
import * as bodyParser from 'body-parser';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import * as cors from 'cors';
import { Application } from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import { getMetadataArgsStorage, useContainer, useExpressServer } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as swaggerUi from 'swagger-ui-express';
import { envConfiguration, keyVaultConfiguration } from './EnvConfiguration';
import { buildModules } from '../../modules';
import { HealthCheckController } from '../../modules/healthcheck/HealthCheckController';
import { OnboardingController } from '../../modules/onboarding/OnboardingController';
import { ProfileController } from '../../modules/profile/ProfileController';
import { ResourcesController } from '../../modules/resources/ResourcesController';
import { TipsController } from '../../modules/tips/TipsController';
import { AppKernel } from '../di/AppKernel';
import { buildMiddlewares } from '../middlewares';
import { CustomErrorHandler } from '../middlewares/CustomErrorHandler';
import { ContractController } from '../../modules/contract/ContractController';
import { CustomerServiceController } from '../../modules/customerService/CustomerServiceController';

const prefix = '/profile';

export async function configureEnvs(envPath: string) {
  /* istanbul ignore next */ // We ignore this test case because we dont want to test app in Production mode.
  await new ConfigService({
    localUri: process.env.NODE_ENV === 'production' ? null : envPath,
    keyvaultUri: process.env.KEYVAULT_URI,
  }).loadEnv();
}

export async function configureApp(envPath: string, inmemory: boolean): Promise<AppKernel> {
  await configureEnvs(envPath);
  const container = await new AppKernel(envConfiguration, keyVaultConfiguration).initDependencies(inmemory);
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
        title: 'Odb Profile Open Api documentation',
        version: '1.0.0',
      },
    },
  );
  app.use(`${prefix}/docs`, swaggerUi.serve);
  app.get(`${prefix}/docs`, swaggerUi.setup(spec));
}

export async function initRouter(app: Application, envPath: string): Promise<void> {
  await configureEnvs(envPath);

  /* istanbul ignore next cause we don't want to test AppInsights middleware */
  if (envConfiguration.useAppInsights && keyVaultConfiguration.appInsightKey) {
    const appInsightMiddleware = new ExpressAppInsightsMiddleware();
    appInsightMiddleware
      .configure(app, {
        instrumentationKey: keyVaultConfiguration.appInsightKey,
        trackBodies: true,
        traceConsoleLogs: true,
      })
      .start();
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors());
  app.use(helmet());
  app.use(morgan('combined'));
  configureDocumentation(app);
  useExpressServer(app, {
    defaultErrorHandler: false,
    middlewares: [CustomErrorHandler],
    routePrefix: prefix,
    controllers: [
      ProfileController,
      TipsController,
      HealthCheckController,
      OnboardingController,
      ResourcesController,
      ContractController,
      CustomerServiceController,
    ],
  });
}
