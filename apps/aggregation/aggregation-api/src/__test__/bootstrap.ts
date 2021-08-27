import { initMongooseConnection } from '@oney/aggregation-adapters';
import { ConfigService } from '@oney/envs';
import * as bodyParser from 'body-parser';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import * as cors from 'cors';
import { Application } from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import { Container } from 'inversify';
import { useExpressServer, useContainer, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as swaggerUi from 'swagger-ui-express';
import { UserController } from '../modules/user/UserController';
import { HealthCheckController } from '../modules/healthcheck/HealthCheckController';
import { BankConnectionController } from '../modules/bankConnection/BankConnectionController';
import { BankController } from '../modules/bank/BankController';
import { AuthController } from '../modules/auth/AuthController';
import { buildModules } from '../modules';
import { CustomErrorMiddleware } from '../modules/middlewares/CustomErrorMiddleware';
import { buildMiddlewares } from '../modules/middlewares';
import { AppKernel } from '../config/di/AppKernel';
import { TermsController } from '../modules/terms/TermsController';
import { DomainErrorMiddleware } from '../modules/middlewares/DomainErrorMiddleware';
import { CreditProfileController } from '../modules/creditProfile/CreditProfileController';

const prefix = '/aggregation';

export async function configureEnvs(envPath: string): Promise<void> {
  /* istanbul ignore next: We ignore this test case because we dont want to test app in Production mode. */
  await new ConfigService({ localUri: process.env.NODE_ENV === 'production' ? null : envPath }).loadEnv();
} // use for testing

/* istanbul ignore next: */

export async function configureApp(
  testConfiguration: any,
  inmemory: boolean,
  mongoUrl: string,
): Promise<Container> {
  const container = await new AppKernel(testConfiguration).initAppDependencies(inmemory);
  if (!inmemory) {
    await initMongooseConnection(mongoUrl);
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
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
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
