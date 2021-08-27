import 'reflect-metadata';
import { describe, beforeAll, it, expect, beforeEach, afterAll, jest } from '@jest/globals';
import { ConfigService } from '@oney/env';
import * as express from 'express';
import * as supertest from 'supertest';
import * as path from 'path';
import { Configuration } from '../../config/config.env';
import {
  buildAppKernel,
  configureApp,
  configureDatabase,
  configureEventDispatcher,
  configureRouter,
} from '../../services/server';
import { userCredentials } from '../fixtures/UserCredentials';
import { RecipientModel } from '../../database/schemas/recipient';
import { recipientToSaveInDbMocked } from '../fixtures/preferences/PreferencesRouteApiFixture';

jest.mock('@azure/service-bus', () => {
  return {
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
  };
});

describe('GET /preferences/[uid] route', () => {
  let app;
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/../env/test.env');
    await new ConfigService({ localUri: envPath }).loadEnv();
    const config = new Configuration();
    // Logger.setup(config.loggerLevel, config.appInfo);
    await configureEventDispatcher(config.serviceBusConfiguration);
    const kernelContainer = await configureEventDispatcher(config.serviceBusConfiguration, true);
    buildAppKernel(kernelContainer);
    await configureDatabase({ uri: process.env.MONGO_URL });
    app = express();
    configureApp(app);
    configureRouter(app);
  });

  beforeEach(async () => {
    await RecipientModel.deleteMany({});
  });

  afterAll(() => app.close());

  it('should get not found when user notification preferences do not exist', async () => {
    await supertest(app)
      .get(`/notifications/preferences/${userCredentials.uid}`)
      .set('Authorization', `Bearer ${userCredentials.token}`)
      .expect(404);
  });

  it('should get user notification preferences when they exist', async () => {
    await RecipientModel.create(recipientToSaveInDbMocked);

    const { status, body } = await supertest(app)
      .get(`/notifications/preferences/${userCredentials.uid}`)
      .set('Authorization', `Bearer ${userCredentials.token}`);

    expect(status).toEqual(200);
    expect(body).toEqual({
      uid: userCredentials.uid,
      allowAccountNotifications: true,
      allowTransactionNotifications: true,
    });
  });
});
