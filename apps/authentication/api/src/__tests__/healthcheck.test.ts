import 'reflect-metadata';
import { Application } from 'express';
import * as express from 'express';
import * as request from 'supertest';
import * as path from 'path';
import { bootstrap } from './fixtures/bootstrap';

const app: Application = express();

jest.mock('@azure/service-bus', () => {
  return {
    ReceiveMode: {
      peekLock: 1,
      receiveAndDelete: 2,
    },
    ServiceBusClient: {
      createFromConnectionString: jest.fn().mockReturnValue({
        name: 'AzureBus',
        createTopicClient: jest.fn().mockReturnValue({
          createSender: jest.fn().mockReturnValue({
            send: jest.fn(),
          }),
        }),
        createSubscriptionClient: jest.fn().mockReturnValue({
          addRule: jest.fn(),
          createReceiver: jest.fn().mockReturnValue({
            registerMessageHandler: jest.fn(),
            receiveMessages: jest.fn().mockReturnValue([]),
          }),
        }),
      }),
    },
  };
});

describe('HealthCheck integration api testing', () => {
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/env/test.env');
    await bootstrap(envPath, process.env.MONGO_URL, process.env.MONGO_DB_NAME, app);
  });

  it('Should Received 200 on healthCheck on /status', async () => {
    // WHEN
    return request(app).get('/authentication/status').expect(200);
  });

  it('Should Received 200 on healthCheck on /ping', async () => {
    // WHEN
    return request(app).get('/authentication/ping').expect(200);
  });
});
