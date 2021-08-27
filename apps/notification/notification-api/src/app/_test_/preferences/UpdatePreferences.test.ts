import 'reflect-metadata';
import { afterAll, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ConfigService } from '@oney/env';
import * as express from 'express';
import * as supertest from 'supertest';
import * as path from 'path';
import { config } from '../../config/config.env';
import { getKernelDependencies } from '../../di/config.kernel';
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
import { Preferences } from '../../domain/valuesObjects/Preferences';

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

describe('PUT /preferences route', () => {
  let app;
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/../env/test.env');
    await new ConfigService({ localUri: envPath }).loadEnv();
    // Logger.setup(config.loggerLevel, config.appInfo);
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

  it('should return preferences properties and dispatch event', async () => {
    const { updatePreferences } = getKernelDependencies();
    await RecipientModel.create(recipientToSaveInDbMocked);
    const expectedPreferencesToUpdate = {
      allowAccountNotifications: false,
      allowTransactionNotifications: false,
    };

    const {
      props: { preferences: updatedPreferences },
    } = await updatePreferences.execute({
      preferences: expectedPreferencesToUpdate,
      uid: recipientToSaveInDbMocked.uid,
    });

    expect(updatedPreferences).toEqual(Preferences.create(expectedPreferencesToUpdate));
  });

  it('should update user notification preferences when they exist', async () => {
    await RecipientModel.create(recipientToSaveInDbMocked);
    const expectedPreferencesToUpdate = {
      allowAccountNotifications: false,
      allowTransactionNotifications: false,
    };

    await supertest(app)
      .put(`/notifications/preferences/${userCredentials.uid}`)
      .set('Authorization', `Bearer ${userCredentials.token}`)
      .send(expectedPreferencesToUpdate)
      .expect(200)
      .expect(({ body: preferences }) => {
        expect(preferences).toEqual({
          uid: userCredentials.uid,
          allowAccountNotifications: false,
          allowTransactionNotifications: false,
        });
      });
  });

  it('should return error: RECIPIENT_NOT_FOUND when user/recipient doesnt exist', async () => {
    await supertest(app)
      .put(`/notifications/preferences/${userCredentials.uid}`)
      .set('Authorization', `Bearer ${userCredentials.token}`)
      .send(recipientToSaveInDbMocked.preferences)
      .expect(404)
      .expect(({ body: error }) => {
        expect(error).toEqual({
          error: 'RecipientNotFound',
          message: 'RECIPIENT_NOT_FOUND',
        });
      });
  });
});
