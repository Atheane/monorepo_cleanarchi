/* eslint-disable */
import 'reflect-metadata';
import 'applicationinsights';
import { configureApp, configureRoute } from './server/config/express';

require('dotenv').config();
const envPath = 'apps/payment/payment-api/local.env';
import * as express from 'express';

const app = express();

configureApp(app, envPath);
configureRoute(app);

app.listen(process.env.PORT, () => {
  console.log(`server started on port ${process.env.PORT} on env ${process.env.NODE_ENV}`);
});
