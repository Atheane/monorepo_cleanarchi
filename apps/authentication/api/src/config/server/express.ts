import { ExpressAppInsightsMiddleware } from '@oney/applicationinsights-enhanced';
import { ConfigService } from '@oney/envs';
import { configureIdentityLib, getServiceHolderIdentity } from '@oney/identity-adapters';
import { ServiceName } from '@oney/identity-core';
import { SymLogger } from '@oney/logger-core';
import { EventHandlerExecutionFinder, EventHandlerExecutionStore } from '@oney/messages-core';
import * as bodyParser from 'body-parser';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import * as cors from 'cors';
import { Application } from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import { useExpressServer, useContainer, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as swaggerUi from 'swagger-ui-express';
import { configureMongoEventHandlerExecution, createAzureConnection } from '@oney/az-servicebus-adapters';
import * as sanitize from 'sanitize';
import { envConfiguration } from './Envs';
import { buildModules } from '../../modules';
import { AuthController } from '../../modules/auth/AuthController';
import { HealthCheckController } from '../../modules/healthcheck/HealthCheckController';
import { PartnerController } from '../../modules/partners/partner.controller';
import { ProvisionningController } from '../../modules/provisionning/ProvisionningController';
import { RegisterController } from '../../modules/register/register.controller';
import { ScaController } from '../../modules/sca/scaController';
import { UserController } from '../../modules/user/userController';
import { AppKernel } from '../di/AppKernel';
import { buildMiddlewares } from '../middlewares';
import { CustomErrorHandler } from '../middlewares/CustomErrorHandler';

export const prefix = '/authentication';

// Configure and init ACL Middleware Here. Just check if token exist decode and retriece access control list.
// If token not provided let the flow continue and return 401.

export async function configureEnvs(envPath: string) {
  /* istanbul ignore next */ // We ignore this test case because we dont want to test app in Production mode.
  await new ConfigService({
    localUri: process.env.NODE_ENV === 'production' ? null : envPath,
    keyvaultUri: process.env.AUTH_KEY_VAULT_URI,
  }).loadEnv();
} // We ignore this test case because we dont want to test app in Production mode.

/* istanbul ignore next */ export async function configureApp(
  app: Application,
  envPath: string,
): Promise<AppKernel> {
  await configureEnvs(envPath);

  const localConfiguration = envConfiguration.getLocalVariables();
  const appInsightMiddleware = new ExpressAppInsightsMiddleware();
  if (localConfiguration.useAppInsight) {
    appInsightMiddleware
      .configure(app, {
        instrumentationKey: envConfiguration.getKeyvaultSecret().appInsightConfiguration.appInsightKey,
        trackBodies: localConfiguration.appInsightTrackBodies,
        traceConsoleLogs: localConfiguration.appInsightTrackConsoleLogs,
      })
      .start();
  }

  const container = await new AppKernel(envConfiguration).initDependencies();

  await configureIdentityLib(container, {
    secret: envConfiguration.getKeyvaultSecret().jwt.auth.secret,
    jwtOptions: {
      ignoreExpiration: false,
    },
    azureTenantId: envConfiguration.getKeyvaultSecret().azureAdTenantId,
    serviceName: ServiceName.authentication,
    azureClientIds: {
      pp_de_reve: envConfiguration.getLocalVariables().azureAuthConfiguration.ppDeReve,
      oney_compta: null,
    },
    applicationId: envConfiguration.getKeyvaultSecret().applicationId, // tofill
  });
  const authAccessServiceKey = await getServiceHolderIdentity(container, ServiceName.authentication);

  await container
    .initStorageDependencies(authAccessServiceKey, envConfiguration.getLocalVariables().frontDoorApiBaseUrl)
    .mongoDb(
      envConfiguration.getKeyvaultSecret().cosmosDbConnectionString,
      envConfiguration.getLocalVariables().cosmosDbDatabaseName,
    );

  configureMongoEventHandlerExecution(container);

  await container.addMessagingPlugin(
    createAzureConnection(
      envConfiguration.getKeyvaultSecret().eventConfiguration.serviceBusConnectionString,
      envConfiguration.getKeyvaultSecret().eventConfiguration.subscription,
      envConfiguration.getLocalVariables().authenticationTopic,
      container.get(SymLogger),
      container.get(EventHandlerExecutionFinder),
      container.get(EventHandlerExecutionStore),
    ),
  );

  await container.initSubscribers(envConfiguration);
  useContainer(container);
  buildModules(container);
  buildMiddlewares(container);
  return container;
} // We ignore this test case because we dont want to test app in Production mode.

/* istanbul ignore next */ function configureDocumentation(app: Application) {
  app.use(sanitize.middleware);
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
        title: 'Odb Authentication Open Api documentation',
        version: '1.0.0',
      },
    },
  );
  app.use(`${prefix}/docs`, swaggerUi.serve);
  app.get(`${prefix}/docs`, swaggerUi.setup(spec));
} // We ignore this test case because we dont want to test app in Production mode.

/* istanbul ignore next */ export async function initRouter(app: Application) {
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
      AuthController,
      ScaController,
      RegisterController,
      UserController,
      HealthCheckController,
      PartnerController,
      ProvisionningController,
    ],
  });
}
