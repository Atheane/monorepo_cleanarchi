/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { Application } from 'express';
import * as express from 'express';
import * as nock from 'nock';
import * as request from 'supertest';
import * as path from 'path';
import { bootstrap } from './fixtures/bootstrap';

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
            receiveMessages: jest.fn().mockReturnValue([
              {
                body: JSON.stringify({
                  eventName: 'ORDER_CREATED',
                }),
                complete: jest.fn(),
              },
              {
                body: JSON.stringify({
                  eventName: 'ORDER_UPDATED',
                }),
                complete: jest.fn(),
              },
            ]),
          }),
        }),
      }),
    },
  };
});

const app: Application = express();
const nockBack = nock.back;

const before = (scope: any) => {
  // eslint-disable-next-line no-param-reassign
  scope.filteringRequestBody = (body: string) => {
    return body;
  };
};

nockBack.fixtures = path.resolve(`${__dirname}/fixtures/smoneyAccount`);
describe('HealthCheck integration api testing', () => {
  beforeAll(async () => {
    const { nockDone } = await nockBack('getAccessTokenForCreateUser.json', { before });
    const envPath = path.resolve(__dirname + '/env/test.env');
    await bootstrap(app, envPath, process.env.MONGO_URL);
    nockDone();
  });

  it('Should Received 200 on healthCheck', async () => {
    // WHEN
    const response = await request(app).get('/payment/status');
    expect(response.status).toBe(200);
    expect(response.text).toBe('OK');
  });
});
