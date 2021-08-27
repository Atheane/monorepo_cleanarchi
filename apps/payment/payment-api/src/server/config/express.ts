import { ExpressAppInsightsMiddleware } from '@oney/applicationinsights-enhanced';
import { configureMongoEventHandlerExecution, createAzureConnection } from '@oney/az-servicebus-adapters';
import { ConfigService } from '@oney/envs';
import { ServiceName } from '@oney/identity-core';
import { SymLogger } from '@oney/logger-core';
import { EventHandlerExecutionFinder, EventHandlerExecutionStore } from '@oney/messages-core';
import { PaymentKernel } from '@oney/payment-adapters';
import * as bodyParser from 'body-parser';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import cors from 'cors';
import { Application } from 'express';
import * as helmet from 'helmet';
import morgan from 'morgan';
import { useExpressServer, useContainer, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as swaggerUi from 'swagger-ui-express';
import { envConfiguration, keyVaultConfiguration } from './EnvConfiguration';
import { buildMiddleware } from './middlewares';
import { DomainErrorMiddleware } from './middlewares/DomainErrorsMiddleware';
import { buildModules } from '../../modules';
import { CardController } from '../../modules/accounts/cards/controllers/CardController';
import { DebtsController } from '../../modules/accounts/debts/controllers/DebtsController';
import { HealthcheckController } from '../../modules/healthcheck/controllers/HealthcheckController';
import { PaymentController } from '../../modules/payments/controllers/PaymentController';
import { TransferController } from '../../modules/transfer/controllers/TransferController';
import { UserController } from '../../modules/user/controllers/UserController';
import { LimitsController } from '../../modules/accounts/limits/controllers/LimitsController';
import { ScaMiddleware } from './middlewares/ScaMiddleware';

export async function configureApp(app: Application, envPath: string) {
  const useSystemEnv = ['production'];
  await new ConfigService({
    localUri: useSystemEnv.includes(process.env.NODE_ENV) ? null : envPath,
    keyvaultUri: process.env.KEYVAULT_URI,
  }).loadEnv();

  if (envConfiguration.useAppInsight && keyVaultConfiguration.appInsightKey) {
    const appInsightMiddleware = new ExpressAppInsightsMiddleware();
    appInsightMiddleware
      .configure(app, {
        instrumentationKey: keyVaultConfiguration.appInsightKey,
        trackBodies: true,
        traceConsoleLogs: true,
      })
      .start();
  }

  const container = new PaymentKernel(envConfiguration, keyVaultConfiguration);
  await container.initServiceDependencies({
    jwtOptions: {
      ignoreExpiration: false,
    },
    azureTenantId: '',
    frontDoorBaseApiUrl: envConfiguration.frontDoorApiBaseUrl,
    secret: keyVaultConfiguration.jwtSecret,
    serviceName: ServiceName.payment,
    applicationId: null,
    azureClientIds: {
      oney_compta: null,
      pp_de_reve: null,
    },
  });
  const kernel = container.initCache().useDb(false);

  configureMongoEventHandlerExecution(container);

  // need to add messaging dependencies before initDependencies() to be able to use event dispatcher in network provider
  await kernel
    .addMessagingPlugin(
      createAzureConnection(
        keyVaultConfiguration.serviceBusUrl,
        envConfiguration.serviceBusSub,
        envConfiguration.serviceBusTopic,
        container.get(SymLogger),
        kernel.get(EventHandlerExecutionFinder),
        kernel.get(EventHandlerExecutionStore),
      ),
    )
    .initDependencies();
  await container.initSubscribers();
  buildModules(container);
  buildMiddleware(container);
  useContainer(container);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(morgan('combined'));
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
      routePrefix: '/payment',
      components: { schemas },
      info: {
        title: 'Odb Payment Open Api documentation',
        version: '1.0.0',
      },
    },
  );
  app.use('/payment/docs', swaggerUi.serve);
  app.get('/payment/docs', swaggerUi.setup(spec));
}

export function configureRoute(app: Application) {
  app.use(cors());
  app.use(helmet());
  useExpressServer(app, {
    defaultErrorHandler: false,
    routePrefix: '/payment',
    middlewares: [ScaMiddleware, DomainErrorMiddleware],
    controllers: [
      HealthcheckController,
      PaymentController,
      TransferController,
      CardController,
      UserController,
      DebtsController,
      LimitsController,
    ],
  });
  configureDocumentation(app);
}
