import 'reflect-metadata';
import 'applicationinsights';
import { defaultLogger } from '@oney/logger-adapters';
import * as express from 'express';
import * as helmet from 'helmet';
import { configureApp, initRouter } from './config/server/express';

const app = express();
const envPath = 'apps/aggregation/aggregation-api/local.env';

(async () => {
  app.use(helmet());
  await configureApp(app, envPath, false);
  defaultLogger.info('server configured');

  await initRouter(app);
  defaultLogger.info('router initialized');
})();

// Add a .env file with PORT.
app.listen(process.env.PORT, () => {
  console.log(`server started on port ${process.env.PORT} on env ${process.env.NODE_ENV}`);
});
