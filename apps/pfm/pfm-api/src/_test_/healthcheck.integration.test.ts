import * as request from 'supertest';
import * as express from 'express';
import * as path from 'path';
import { configureApp, initRouter } from '../config/server/express';

jest.mock('@azure/storage-blob', () => ({
  BlobServiceClient: {
    fromConnectionString: jest.fn().mockReturnValue({
      getContainerClient: jest.fn().mockReturnValue({
        getBlobClient: jest.fn().mockReturnValue({}),
      }),
    }),
  },
}));

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

const app: express.Application = express();
describe('Healthcheck integration api testing', () => {
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/env/test.env');
    await configureApp(app, envPath, process.env.MONGO_URL);
    await initRouter(app);
  });

  it('Should request status OK', async () => {
    const { status } = await request(app).get('/pfm/status');

    expect(status).toEqual(200);
  });
});
