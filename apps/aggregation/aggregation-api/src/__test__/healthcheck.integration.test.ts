import * as express from 'express';
import * as nock from 'nock';
import * as request from 'supertest';
import * as path from 'path';
import { configureApp, initRouter } from './bootstrap';
import { testConfiguration } from './config';

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
  let saveFixture: Function;
  const testIt: any = test;
  const app: express.Application = express();

  beforeAll(async () => {
    await configureApp(testConfiguration, false, process.env.MONGO_URL);
    await initRouter(app);
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures`);
    nock.back.setMode('record');
  });

  beforeEach(async () => {
    nock.restore();
    nock.activate();
    const { nockDone } = await nock.back(testIt.getFixtureName());
    saveFixture = nockDone;

    nock.enableNetConnect(/127\.0\.0\.1/);
  });

  afterEach(async () => {
    const nockObjects = nock.recorder.play();
    if (nockObjects.length == 0) {
      nock.restore();
    } else {
      console.log('saving nock fixture for: ', testIt.getFixtureName());
      saveFixture();
    }
  });

  it('Should request status OK', async () => {
    const response = await request(app).get('/aggregation/status');
    expect(response.status).toBe(200);
    expect(response.text).toBe('OK');
  });
});
