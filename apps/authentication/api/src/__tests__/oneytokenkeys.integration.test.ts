import 'reflect-metadata';
import 'reflect-metadata';
import { Application } from 'express';
import * as express from 'express';
import * as request from 'supertest';
import * as path from 'path';
import { getUserToken } from './fixtures/auth.fixtures';
import { bootstrap } from './fixtures/bootstrap';
import { envConfiguration } from '../config/server/Envs';

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

describe('Oney Token Keys integration api testing', () => {
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/env/test.env');
    const container = await bootstrap(envPath, process.env.MONGO_URL, process.env.MONGO_DB_NAME, app);
    await getUserToken(container);
  });

  it('Should return they oney public keys', async () => {
    return request(app)
      .get(`/authentication/partner/oneyfr/token_keys`)
      .set('Authorization', `Basic ${envConfiguration.getKeyvaultSecret().basicAuthKey}`)
      .send()
      .expect(200, {
        keys: [
          {
            kid: 'fakeKid',
            alg: 'RS256',
            kty: 'RSA',
            use: 'sig',
            n: 'fakeModulus',
            e: 'fakeExponent',
          },
        ],
      });
  });
});
