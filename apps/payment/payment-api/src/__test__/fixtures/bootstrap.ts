import { ExpressAppInsightsMiddleware } from '@oney/applicationinsights-enhanced';
import { configureMongoEventHandlerExecution, createAzureConnection } from '@oney/az-servicebus-adapters';
import { ConfigService } from '@oney/envs';
import { ServiceName } from '@oney/identity-core';
import { SymLogger } from '@oney/logger-core';
import { EventHandlerExecutionFinder, EventHandlerExecutionStore } from '@oney/messages-core';
import { PaymentKernel } from '@oney/payment-adapters';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { Application } from 'express';
import * as helmet from 'helmet'; // use for testing
import * as morgan from 'morgan';
import { useExpressServer, useContainer } from 'routing-controllers';
import { buildModules } from '../../modules';
import { CardController } from '../../modules/accounts/cards/controllers/CardController';
import { DebtsController } from '../../modules/accounts/debts/controllers/DebtsController';
import { HealthcheckController } from '../../modules/healthcheck/controllers/HealthcheckController';
import { PaymentController } from '../../modules/payments/controllers/PaymentController';
import { TransferController } from '../../modules/transfer/controllers/TransferController';
import { UserController } from '../../modules/user/controllers/UserController';
import { envConfiguration, keyVaultConfiguration } from '../../server/config/EnvConfiguration';
import { buildMiddleware } from '../../server/config/middlewares';
import { DomainErrorMiddleware } from '../../server/config/middlewares/DomainErrorsMiddleware';
import { LimitsController } from '../../modules/accounts/limits/controllers/LimitsController';
import { ScaMiddleware } from '../../server/config/middlewares/ScaMiddleware';

/* istanbul ignore next: */ export async function bootstrap(
  app: Application,
  envPath: string,
  mongoUrl: string,
): Promise<PaymentKernel> {
  const useSystemEnv = ['production'];
  await new ConfigService({
    localUri: useSystemEnv.includes(process.env.NODE_ENV) ? null : envPath,
  }).loadEnv();

  const overridenConfig = {
    ...envConfiguration,
    accountManagementMongoDbDatabase: process.env.MONGO_DB_NAME,
    transactionsMongoDbDatabase: process.env.MONGO_DB_NAME,
  };

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
  const container = await new PaymentKernel(overridenConfig, keyVaultConfiguration);

  await container.initServiceDependencies({
    jwtOptions: {
      ignoreExpiration: false,
    },
    azureTenantId: '',
    secret: keyVaultConfiguration.jwtSecret,
    serviceName: ServiceName.payment,
    frontDoorBaseApiUrl: envConfiguration.frontDoorApiBaseUrl,
    azureClientIds: {
      oney_compta: null,
      pp_de_reve: null,
    },
    applicationId: null,
  });
  const kernel = container.useDb(false, mongoUrl);

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
    .initCache()
    .initDependencies();
  await container.initSubscribers();
  buildModules(container);
  buildMiddleware(container);
  useContainer(container);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(morgan('combined'));
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
  return container;
}
