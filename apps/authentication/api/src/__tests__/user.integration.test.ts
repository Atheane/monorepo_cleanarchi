import 'reflect-metadata';
import {
  AuthFactor,
  AuthStatus,
  Channel,
  DefaultDomainErrorMessages,
  DefaultUiErrorMessages,
  UserError,
} from '@oney/authentication-core';
import { Application } from 'express';
import * as express from 'express';
import * as request from 'supertest';
import * as path from 'path';
import { getUserToken, user } from './fixtures/auth.fixtures';
import { bootstrap } from './fixtures/bootstrap';
import { AppKernel } from '../config/di/AppKernel';
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

describe('User integration api testing', () => {
  let container: AppKernel;
  let userToken: string;
  let scaToken: string;

  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/env/test.env');
    container = await bootstrap(envPath, process.env.MONGO_URL, process.env.MONGO_DB_NAME, app);
    userToken = await getUserToken(container);
  });

  it('should retrieve a user which does not have any pincode set\n', async () =>
    request(app)
      .get('/authentication/user')
      .set('Authorization', `bearer ${userToken}`)
      .expect(200)
      .expect(response => {
        // Then
        expect(response.body.uid).toEqual(user.props.uid);
        expect(response.body.email).toEqual(user.props.email.address);
        expect(response.body.pinCode.isSet).toBeFalsy();
        expect(response.body.pinCode.deviceId).toBeFalsy();
      }));

  it('should try to reset pinCode without pinCode setted', async () => {
    await request(app)
      .delete(`/authentication/user/${user.props.uid}/pincode`)
      .set('Authorization', `bearer ${userToken}`)
      .expect(403)
      .expect(response => {
        // Then
        expect(response.body.name).toMatch(UserError.PinCodeNotSet.name);
      });
  });

  it('Should set a pin code for the user', async () => {
    // Given
    const payload = {
      deviceId: 'apzoekazoe',
      value: '123456',
    };

    return request(app)
      .post('/authentication/user/pincode')
      .set('Authorization', `bearer ${userToken}`)
      .send(payload)
      .expect(201)
      .expect(response => {
        // Then
        expect(response.body.uid).toEqual(user.props.uid);
        expect(response.body.email).toEqual(user.props.email.address);
      });
  });

  it('should try to reset pinCode and trigger sca with authent mode different of pinCode', async () => {
    await request(app)
      .delete(`/authentication/user/${user.props.uid}/pincode`)
      .expect(403)
      .expect(response => {
        // Then
        scaToken = response.header.sca_token;
        expect(response.body.channel).toMatch(Channel.EMAIL);
        expect(response.body.factor).toMatch(AuthFactor.OTP);
        expect(response.body.action.type).toEqual('CLEAR_PIN_CODE');
      });
  });

  it('should return 404 when user not found when attempting to clear pinCode', async () => {
    const notExistUId = 't';
    const notFound = 404;
    await request(app)
      .delete(`/authentication/user/${notExistUId}/pincode`)
      .expect(notFound)
      .expect(response => {
        expect(response.body).toMatchObject({
          code: notFound,
          type: DefaultDomainErrorMessages.USER_NOT_FOUND,
          message: DefaultUiErrorMessages.USER_NOT_FOUND,
        });
      });
  });

  it('should validate sca', async () => {
    // Given
    const payload = {
      credentials: '00000000',
    };

    return request(app)
      .post('/authentication/sca/verify')
      .set('sca_token', scaToken)
      .send(payload)
      .expect(200)
      .expect(response => {
        // Then
        expect(response.body.status).toMatch(AuthStatus.DONE);
      });
  });

  it('should reset pinCode', async () => {
    await request(app)
      .delete(`/authentication/user/${user.props.uid}/pincode`)
      .set('sca_token', scaToken)
      .expect(200);
  });

  it('Should send an error cause pin code is non 6 digits', async () => {
    // Given
    const payload = {
      deviceId: 'apzoekazoe',
      value: '125',
    };

    return request(app)
      .post('/authentication/user/pincode')
      .set('Authorization', `bearer ${userToken}`)
      .send(payload)
      .expect(403)
      .expect(response => {
        // Then
        expect(response.body.name).toMatch(UserError.NonValidDigitPinCode.name);
      });
  });

  it('should validate sca [Deprecated]', async () => {
    // Given
    const payload = {
      credentials: '00000000',
    };

    return request(app)
      .post('/authentication/sca/verify')
      .set('Authorization', `bearer ${userToken}`)
      .set('sca_token', scaToken)
      .send(payload)
      .expect(200)
      .expect(response => {
        // Then
        expect(response.body.status).toMatch(AuthStatus.DONE);
      });
  });

  it('Should send an error cause pin code is non 6 digits [Deprecated]', async () => {
    // Given
    const payload = {
      deviceId: 'apzoekazoe',
      value: '125',
    };

    return request(app)
      .post('/authentication/user/pincode')
      .set('Authorization', `bearer ${userToken}`)
      .send(payload)
      .expect(403)
      .expect(response => {
        // Then
        expect(response.body.name).toMatch(UserError.NonValidDigitPinCode.name);
      });
  });

  it('should set default user token expiration time if environment variable is invalid', async () => {
    const defaultExp = 30;
    const expirationTime = envConfiguration.getKeyvaultSecret().jwt.auth.expiredAt(Number('toto'))();
    const diff = Math.round((expirationTime - Date.now()) / (60 * 1000));
    expect(diff).toBe(defaultExp);
  });

  it('should set default user token expiration time if environment variable is a negative number', async () => {
    const defaultExp = 30;
    const expirationTime = envConfiguration.getKeyvaultSecret().jwt.auth.expiredAt(-22)();
    const diff = Math.round((expirationTime - Date.now()) / (60 * 1000));
    expect(diff).toBe(defaultExp);
  });

  it('should set default user token expiration time if environment variable is a floating point number', async () => {
    const defaultExp = 30;
    const expirationTime = envConfiguration.getKeyvaultSecret().jwt.auth.expiredAt(23.75)();
    const diff = Math.round((expirationTime - Date.now()) / (60 * 1000));
    expect(diff).toBe(defaultExp);
  });
});
