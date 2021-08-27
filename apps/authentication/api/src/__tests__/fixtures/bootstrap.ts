import { configureIdentityLib, getServiceHolderIdentity } from '@oney/identity-adapters';
import { ServiceName } from '@oney/identity-core';
import { SymLogger } from '@oney/logger-core';
import { EventHandlerExecutionFinder, EventHandlerExecutionStore } from '@oney/messages-core';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { Application } from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import { useContainer, useExpressServer } from 'routing-controllers';
import { configureMongoEventHandlerExecution, createAzureConnection } from '@oney/az-servicebus-adapters';
import { AppKernel } from '../../config/di/AppKernel';
import { buildMiddlewares } from '../../config/middlewares';
import { CustomErrorHandler } from '../../config/middlewares/CustomErrorHandler';
import { envConfiguration } from '../../config/server/Envs';
import { configureEnvs, prefix } from '../../config/server/express';
import { buildModules } from '../../modules';
import { AuthController } from '../../modules/auth/AuthController';
import { HealthCheckController } from '../../modules/healthcheck/HealthCheckController';
import { PartnerController } from '../../modules/partners/partner.controller';
import { ProvisionningController } from '../../modules/provisionning/ProvisionningController';
import { RegisterController } from '../../modules/register/register.controller';
import { ScaController } from '../../modules/sca/scaController';
import { UserController } from '../../modules/user/userController';

export async function bootstrap(envPath: string, dbUrl: string, dbName: string, app: Application) {
  await configureEnvs(envPath);

  const container = await new AppKernel(envConfiguration).initDependencies();

  await configureIdentityLib(container, {
    secret: envConfiguration.getKeyvaultSecret().jwt.auth.secret,
    jwtOptions: {
      ignoreExpiration: true,
    },
    azureTenantId: envConfiguration.getKeyvaultSecret().azureAdTenantId,
    serviceName: ServiceName.authentication,
    azureClientIds: {
      pp_de_reve: envConfiguration.getLocalVariables().azureAuthConfiguration.ppDeReve,
      oney_compta: null,
    },
    applicationId: envConfiguration.getKeyvaultSecret().applicationId,
  });
  const authAccessServiceKey = await getServiceHolderIdentity(container, ServiceName.authentication);

  await container
    .initStorageDependencies(authAccessServiceKey, envConfiguration.getLocalVariables().frontDoorApiBaseUrl)
    .mongoDb(dbUrl, dbName);

  configureMongoEventHandlerExecution(container);

  container.addMessagingPlugin(
    createAzureConnection(
      envConfiguration.getKeyvaultSecret().eventConfiguration.serviceBusConnectionString,
      envConfiguration.getKeyvaultSecret().eventConfiguration.subscription,
      envConfiguration.getLocalVariables().authenticationTopic,
      container.get(SymLogger),
      container.get(EventHandlerExecutionFinder),
      container.get(EventHandlerExecutionStore),
    ),
  );

  container.bindDependencies(authAccessServiceKey);

  await container.initSubscribers(envConfiguration);
  useContainer(container);
  buildModules(container);
  buildMiddlewares(container);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors());
  app.use(helmet());
  app.use(morgan('combined'));
  useExpressServer(app, {
    defaultErrorHandler: false,
    middlewares: [CustomErrorHandler],
    routePrefix: prefix,
    controllers: [
      AuthController,
      ScaController,
      HealthCheckController,
      RegisterController,
      UserController,
      ProvisionningController,
      PartnerController,
    ],
  });
  return container;
}
