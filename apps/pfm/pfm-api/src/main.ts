import 'reflect-metadata';
import 'applicationinsights';
import * as express from 'express';
import { configureApp, initRouter } from './config/server/express';

const app = express();
const envPath = 'apps/pfm/pfm-api/local.env';

(async () => {
  await configureApp(app, envPath);
  await initRouter(app);
})();

// Add a file named '.env' with PORT.
app.listen(process.env.PORT, () => {
  console.log(`server started on port ${process.env.PORT} on env ${process.env.NODE_ENV}`);
});
