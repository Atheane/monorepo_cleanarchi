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
import { createConnection } from 'mongoose';
import { configureSaga } from '@oney/saga-adapters';
import { SubscriberActivated, SubscriptionActivated, SubscriptionCreated } from '@oney/subscription-messages';
import { BankAccountOpened, CardCreated } from '@oney/payment-messages';
import { EventCtor } from '@oney/messages-core';
import { configureAzureCommandServiceBus } from '@oney/messages-adapters';
import {
  AddressStepValidated,
  CivilStatusValidated,
  PhoneStepValidated,
  ProfileCreated,
} from '@oney/profile-messages';
import { envConfiguration, keyvaultConfiguration } from './EnvConfiguration';
import { DomainErrorMiddleware } from './middlewares/DomainErrorMiddleware';
import { SubscriptionKernel } from '../di/SubscriptionKernel';
import { buildModules } from '../../modules';
import { HealthcheckController } from '../../modules/healthcheck/controllers/HealthcheckController';
import { OfferController } from '../../modules/offers/OfferController';
import { SubscriptionController } from '../../modules/subscriptions/api/SubscriptionController';
import { OfferSubscribedSagas } from '../../modules/subscriptions/sagas/OfferSubscribedSagas';
import { CreateMembershipInsuranceSagas } from '../../modules/insurance/sagas/CreateMembershipInsuranceSagas';

const prefix = '/subscription';
export async function configureEnvs(envPath: string): Promise<void> {
  /* istanbul ignore next */ // We ignore this test case because we dont want to test app in Production mode.
  await new ConfigService({
    localUri: process.env.NODE_ENV === 'production' ? null : envPath,
    keyvaultUri: process.env.KEYVAULT_URI,
  }).loadEnv();
}

// Cover by bootstrap.ts in test
/* istanbul ignore next */ export async function configureApp(
  app: Application,
  envPath: string,
): Promise<SubscriptionKernel> {
  await configureEnvs(envPath);

  /* istanbul ignore next cause we don't want to test AppInsights middleware */
  if (envConfiguration.useAppInsights && envConfiguration.appInsightKey) {
    const appInsightMiddleware = new ExpressAppInsightsMiddleware();
    appInsightMiddleware
      .configure(app, {
        instrumentationKey: envConfiguration.appInsightKey,
        trackBodies: envConfiguration.trackBodies,
        traceConsoleLogs: envConfiguration.trackConsoleLog,
      })
      .start();
  }

  const container = new SubscriptionKernel(envConfiguration, keyvaultConfiguration);
  await container.initDependencies(
    createConnection(keyvaultConfiguration.mongoDbPath, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
  );
  await container.initSpbConfiguration();
  buildModules(container);
  useContainer(container);
  await configureAzureCommandServiceBus(
    container,
    {
      connectionString: keyvaultConfiguration.serviceBusUrl,
    },
    () => {
      //nothing
    },
  );
  await configureSaga(container, async o => {
    await o.register(OfferSubscribedSagas, {
      eventTopicMap: new Map<EventCtor, string>([
        [SubscriptionCreated, envConfiguration.odbSubscriptionTopic],
        [BankAccountOpened, envConfiguration.odbPaymentTopic],
        [CardCreated, envConfiguration.odbPaymentTopic],
        [SubscriberActivated, envConfiguration.odbSubscriptionTopic],
      ]),
    });
    await o.register(CreateMembershipInsuranceSagas, {
      eventTopicMap: new Map<EventCtor, string>([
        [ProfileCreated, envConfiguration.odbProfileTopic],
        [PhoneStepValidated, envConfiguration.odbProfileTopic],
        [CivilStatusValidated, envConfiguration.odbProfileTopic],
        [AddressStepValidated, envConfiguration.odbProfileTopic],
        [BankAccountOpened, envConfiguration.odbPaymentTopic],
        [CardCreated, envConfiguration.odbPaymentTopic],
        [SubscriptionActivated, envConfiguration.odbSubscriptionTopic],
      ]),
    });
  });
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

export async function initRouter(app: Application): Promise<void> {
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
