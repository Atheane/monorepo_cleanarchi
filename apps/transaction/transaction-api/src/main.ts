/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import * as httpStatus from 'http-status';

const app = express();

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to transaction/transaction-api!' });
});

app.get('/status', (req, res) => {
  res.sendStatus(httpStatus.OK);
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
