import { Context } from '@azure/functions';
import { ConfigService } from '@oney/env';
import { INTERNAL_SERVER_ERROR } from 'http-status';
import * as nock from 'nock';
import * as path from 'path';
import { envConfiguration } from '../config/EnvConfig';
import pushNotificationHandler from '../index';

describe('Test push notification handler', () => {
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/../local.env');
    await new ConfigService({ localUri: envPath }).loadEnv();
  });

  it('should send adapted legacy notification to firebase function', async () => {
    const context = {
      log: () => undefined,
    } as Context;
    const message = { subject: 'PUSH SUBJECT', content: 'PUSH CONTENT', recipient: 'user-1' };

    const scope = nock(envConfiguration.firebaseBaseUrl)
      .post('/api/notification/multicast', {
        notification: {
          display: {
            title: 'PUSH SUBJECT',
            message: 'PUSH CONTENT',
          },
        },
        userIds: ['user-1'],
      })
      .basicAuth({
        user: envConfiguration.firebaseBasicAuthConfig.username,
        pass: envConfiguration.firebaseBasicAuthConfig.password,
      })
      .reply(200);
    await pushNotificationHandler(context, message);

    scope.done();
  });

  it('should send notification to firebase function', async () => {
    const context = {
      log: () => undefined,
    } as Context;
    const message = {
      notification: {
        display: {
          title: 'PUSH SUBJECT',
          message: 'PUSH CONTENT',
        },
        data: 'any other data',
      },
      userIds: ['user-1'],
    };

    const scope = nock(envConfiguration.firebaseBaseUrl)
      .post('/api/notification/multicast', message)
      .basicAuth({
        user: envConfiguration.firebaseBasicAuthConfig.username,
        pass: envConfiguration.firebaseBasicAuthConfig.password,
      })
      .reply(200);
    await pushNotificationHandler(context, message);

    scope.done();
  });

  it('should catch exception', async () => {
    const context = {
      log: () => undefined,
    } as Context;

    nock(envConfiguration.firebaseBaseUrl).post('/api/notification/multicast').reply(500);

    await pushNotificationHandler(context, {});

    expect(context.res.status).toEqual(INTERNAL_SERVER_ERROR);
  });
});
