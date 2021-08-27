import { ExpressAppInsightsMiddleware } from '@oney/applicationinsights-enhanced';
import * as bodyParser from 'body-parser';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import * as cors from 'cors';
import * as express from 'express';
import { Application } from 'express';
import * as helmet from 'helmet';
import { Container, injectable } from 'inversify';
import * as morgan from 'morgan';
import { useExpressServer, useContainer, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as swaggerUi from 'swagger-ui-express';
import { Server } from 'http';
import { HealthcheckController } from './routes/healthcheck/HealthcheckController';
import { AppConfiguration } from '../configuration/app/AppConfiguration';

@injectable()
export class ExpressCDP {
  private _app: Application;
  private _server: Server;
  private _config: AppConfiguration;

  constructor(config: AppConfiguration) {
    this._config = config;
    this._app = express();
  }

  public initialize(container: Container) {
    this._app.use(bodyParser.json());
    this._app.use(bodyParser.urlencoded({ extended: false }));
    this._app.use(morgan('combined'));

    useContainer(container);
  }

  start(): Server {
    this._server = this._app.listen(this._config.port, () => {
      console.log(`server started on port ${this._config.port} on env ${this._config.nodeEnv}`);
    });

    return this._server;
  }

  configureAppInsights(): void | never {
    if (this._config.useAppInsights) {
      if (!this._config.appInsightsKey) {
        throw new Error('The appInsightKey should be specified');
      }

      const appInsightMiddleware = new ExpressAppInsightsMiddleware();
      appInsightMiddleware
        .configure(this._app, {
          instrumentationKey: this._config.appInsightsKey,
          trackBodies: true,
          traceConsoleLogs: true,
        })
        .start();
    }
  }

  configureRoutes(...routes: NewableFunction[]): void {
    this._app.use(cors());
    this._app.use(helmet());

    useExpressServer(this._app, {
      defaultErrorHandler: true,
      routePrefix: '/cdp',
      controllers: [HealthcheckController, ...routes],
    });

    this.configureDocumentation();
  }

  private configureDocumentation(): void {
    const schemas = validationMetadatasToSchemas({
      refPointerPrefix: '#/components/schemas/',
    });
    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(
      storage,
      {},
      {
        routePrefix: '/cdp',
        components: { schemas },
        info: {
          title: 'Odb CDP Open Api documentation',
          version: '1.0.0',
        },
      },
    );
    this._app.use('/cdp/docs', swaggerUi.serve);
    this._app.get('/cdp/docs', swaggerUi.setup(spec));
  }
}
