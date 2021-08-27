import 'reflect-metadata';
import 'applicationinsights';
import * as express from 'express';
import { configureApp, initRouter } from './config/server/express';

const app = express();
const envPath = 'apps/authentication/api/local.env';

configureApp(app, envPath);
initRouter(app);

// Add a .env file with PORT.
app.listen(process.env.PORT, () => {
  console.log(`server started on port ${process.env.PORT} on env ${process.env.NODE_ENV}`);
});
