import 'reflect-metadata';
import 'applicationinsights';
import * as express from 'express';
import { configureApp, initRouter } from './config/server/express';

const app = express();
const envPath = 'apps/profile/profile-api/local.env';

(async () => {
  await configureApp(envPath, false);
  await initRouter(app, envPath);
  app.listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT} on env ${process.env.NODE_ENV}`);
  });
})();
