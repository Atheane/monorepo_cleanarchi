import { ExpressAppInsightsMiddleware } from '@oney/applicationinsights-enhanced';
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
import { createConnection } from 'mongoose';
import { buildModules } from '../../modules';
import { HealthcheckController } from '../../modules/healthcheck/controllers/HealthcheckController';
import { OfferController } from '../../modules/offers/OfferController';
import { envConfiguration, keyvaultConfiguration } from '../../config/server/EnvConfiguration';
import { SubscriptionKernel } from '../../config/di/SubscriptionKernel';
import { SubscriptionController } from '../../modules/subscriptions/api/SubscriptionController';
import { DomainErrorMiddleware } from '../../config/server/middlewares/DomainErrorMiddleware';

const prefix = '/subscription';

export async function configureEnvs(envPath: string) {
  /* istanbul ignore next */ // We ignore this test case because we dont want to test app in Production mode.
  await new ConfigService({
    localUri: process.env.NODE_ENV === 'production' ? null : envPath,
    keyvaultUri: process.env.KEYVAULT_URI,
  }).loadEnv();
}

export async function bootstrap(
  app: Application,
  envPath: string,
  dbUrl: string,
  withSpb?: boolean,
): Promise<SubscriptionKernel> {
  await configureEnvs(envPath);

  /* istanbul ignore next cause we don't want to test AppInsights middleware */
  if (envConfiguration.useAppInsights && envConfiguration.appInsightKey) {
    const appInsightMiddleware = new ExpressAppInsightsMiddleware();
    appInsightMiddleware
      .configure(app, {
        instrumentationKey: envConfiguration.appInsightKey,
        trackBodies: true,
        traceConsoleLogs: true,
      })
      .start();
  }

  const container = new SubscriptionKernel(envConfiguration, keyvaultConfiguration);

  await container.initDependencies(
    createConnection(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
  );
  if (withSpb) {
    await container.initSpbConfiguration();
  }
  buildModules(container);
  useContainer(container);
  await initRouter(app);
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
        title: 'Odb Subscription Open Api documentation',
        version: '1.0.0',
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
  configureDocumentation(app);
  useExpressServer(app, {
    defaultErrorHandler: false,
    middlewares: [DomainErrorMiddleware],
    routePrefix: prefix,
    controllers: [HealthcheckController, OfferController, SubscriptionController],
  });
}
