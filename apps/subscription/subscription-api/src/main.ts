import 'reflect-metadata';
import 'applicationinsights';
import * as express from 'express';
import { configureApp } from './config/server/express';

const app = express();
const envPath = 'apps/subscription/subscription-api/local.env';

configureApp(app, envPath);
// Add a .env file with PORT.
app.listen(process.env.PORT, () => {
  console.log(`server started on port ${process.env.PORT} on env ${process.env.NODE_ENV}`);
});
