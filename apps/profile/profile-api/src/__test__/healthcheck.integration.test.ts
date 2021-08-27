import { Application } from 'express';
import * as express from 'express';
import * as request from 'supertest';
import * as path from 'path';
import { configureApp, initRouter } from '../config/server/express';

const app: Application = express();

jest.mock('@azure/service-bus', () => ({
  ReceiveMode: {
    peekLock: 1,
    receiveAndDelete: 2,
  },
  ServiceBusClient: {
    createFromConnectionString: jest.fn().mockReturnValue({
      createTopicClient: jest.fn().mockReturnValue({
        createSender: jest.fn().mockReturnValue({
          send: jest.fn(),
        }),
      }),
      createSubscriptionClient: jest.fn().mockReturnValue({
        createReceiver: jest.fn().mockReturnValue({
          registerMessageHandler: jest.fn(),
        }),
      }),
    }),
  },
}));

describe('Healthcheck integration api testing', () => {
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/env/test.env');
    await configureApp(envPath, true);
    await initRouter(app, envPath);
  });

  it('Should request status OK', async () => {
    await request(app).get('/profile/status').expect(200);
  });
});
