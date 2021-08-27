import { ConnectionStateEnum, SignIn } from '@oney/aggregation-core';
import * as express from 'express';
import { Container } from 'inversify';
import * as mongoose from 'mongoose';
import * as nock from 'nock';
import * as request from 'supertest';
import * as path from 'path';
import 'reflect-metadata';
import { configureApp, initRouter } from './bootstrap';
import { payloadSignIn, stateCase, createUser } from './fixtures/generate.fixtures';
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

describe('Bank Connection integration api testing', () => {
  let container: Container;
  let saveFixture: Function;
  const testIt: any = test;
  const app: express.Application = express();
  beforeAll(async () => {
    container = await configureApp(testConfiguration, false, process.env.MONGO_URL);
    await initRouter(app);
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures`);
    nock.back.setMode('record');
  });

  beforeEach(async () => {
    nock.restore();
    nock.activate();
    const { nockDone } = await nock.back(testIt.getFixtureName());
    saveFixture = nockDone;

    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
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

  it('Should throw unauthorized', async () => {
    await request(app).post(`/aggregation/connections/connection_sync`).expect(401);
  });

  it('Should throw bank connection not found', async () => {
    const payload = {
      connection: {
        id: 358,
        state: ConnectionStateEnum.PASSWORD_EXPIRED,
      },
    };

    await request(app)
      .post(`/aggregation/connections/connection_sync?code=bGF2aWVlc3RiZWxsZWVweWNldG91`)
      .send(payload)
      .expect(404)
      .expect(({ body: error }) => {
        expect(error).toEqual({
          error: 'BankConnectionNotFound',
          code: 'BANK_CONNECTION_NOT_FOUND',
        });
      });
  });

  it('Should throw state unknown', async () => {
    const userId = 'azehapzgue';
    await createUser(container, userId);
    const connection = await container.get(SignIn).execute(payloadSignIn(userId, stateCase.VALID));

    const payload = {
      connection: {
        id: connection.props.refId,
        state: 'unknown',
      },
    };

    await request(app)
      .post(`/aggregation/connections/connection_sync?code=bGF2aWVlc3RiZWxsZWVweWNldG91`)
      .send(payload)
      .expect(400)
      .expect(({ body: error }) => {
        expect(error).toEqual({
          error: 'StateUnknown',
          code: 'STATE_UNKNOWN',
        });
      });
  });

  it('Should synchronize connection to new state', async () => {
    const userId = 'azehgkuyffx';
    await createUser(container, userId);
    const connection = await container.get(SignIn).execute(payloadSignIn(userId, stateCase.VALID));
    const payload = {
      connection: {
        id: connection.props.refId,
        state: 'SCARequired',
      },
    };

    await request(app)
      .post(`/aggregation/connections/connection_sync?code=bGF2aWVlc3RiZWxsZWVweWNldG91`)
      .send(payload)
      .expect(200)
      .expect(({ body: connection }) => {
        expect.objectContaining({
          connectionId: connection.connectionId,
          state: ConnectionStateEnum.SCA,
        });
      });
  });
});
