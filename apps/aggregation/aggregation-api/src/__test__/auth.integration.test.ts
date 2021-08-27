import * as express from 'express';
import * as mongoose from 'mongoose';
import * as nock from 'nock';
import * as request from 'supertest';
import * as dateMock from 'jest-date-mock';
import { Container } from 'inversify';
import {
  BankConnectionProperties,
  ConnectionStateEnum,
  DeleteBankConnection,
  DeleteUser,
  SignIn,
} from '@oney/aggregation-core';
import * as path from 'path';
import { userTokenFixtures } from './fixtures/userTokenFixtures';
import { configureApp, initRouter } from './bootstrap';
import { testConfiguration } from './config';
import { createUser, payloadSignIn, getUserToken, stateCase } from './fixtures/generate.fixtures';

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

describe('Auth integration api testing', () => {
  dateMock.advanceTo(new Date('2020-05-21T00:00:00.000Z'));

  let container: Container;
  let saveFixture: Function;
  const userId = 'zCDOH_UvA';

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

  it('Should throw unauthorized to signin if user scope does not contain aggregation', async () => {
    await request(app)
      .post('/aggregation/auth/signin')
      .set('authorization', 'Bearer ' + userTokenFixtures.test401api.aggregationReadOnly)
      .send(payloadSignIn(userId, stateCase.VALID))
      .expect(401)
      .expect(({ body: error }) => {
        expect(error).toEqual({
          error: 'UserCannotWrite',
          code: 'USER_CANNOT_WRITE',
          cause: 'user test401api not allowed to write on aggregation',
        });
      });
  });

  it('Should throw unauthorized to sca if token comes from wrong provider', async () => {
    const payloadSCA = {
      connectionId: 'jazieugaze',
      form: [
        {
          name: 'openapisms',
          value: 'abcd',
        },
      ],
    };
    await request(app)
      .post('/aggregation/auth/sca')
      .set('authorization', 'Bearer ' + userTokenFixtures.test401api.aggregationReadOnly)
      .send(payloadSCA)
      .expect(401)
      .expect(({ body: error }) => {
        expect(error).toEqual({
          error: 'UserCannotWrite',
          code: 'USER_CANNOT_WRITE',
          cause: 'user test401api not allowed to write on aggregation',
        });
      });
  });

  it('Should succeed on a valid signin', async () => {
    const userId = 'nmkjhjkhmjkh';

    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);
    const payload = payloadSignIn(userId, stateCase.VALID);
    let connection: BankConnectionProperties;

    await request(app)
      .post('/aggregation/auth/signin')
      .set('authorization', 'Bearer ' + userToken)
      .send(payload)
      .expect(200)
      .expect(({ body }) => {
        connection = body;
        expect(connection.userId).toEqual(userId);
        expect(connection.state).toEqual(ConnectionStateEnum.VALID);
        expect(connection.active).toBeTruthy();
        expect(connection.form).toBeFalsy();
      });

    await container.get(DeleteBankConnection).execute({ userId, connectionId: connection.connectionId });
    await container.get(DeleteUser).execute({ userId });
  });

  it('Should succeed on a valid signin with otp', async () => {
    const userId = 'azeazaz';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);
    const connection = await container.get(SignIn).execute(payloadSignIn(userId, stateCase.OTP));

    const payloadSCA = {
      connectionId: connection.props.connectionId,
      form: [
        {
          name: 'openapisms',
          value: 'abcd',
        },
      ],
    };

    await request(app)
      .post('/aggregation/auth/sca')
      .set('authorization', 'Bearer ' + userToken)
      .send(payloadSCA)
      .expect(200)
      .expect(({ body: connection }) => {
        expect(connection.connectionId).toEqual(payloadSCA.connectionId);
        expect(connection.state).toEqual(ConnectionStateEnum.VALID);
        expect(connection.active).toBeTruthy();
        expect(connection.form).toBeUndefined();
      });
    await container
      .get(DeleteBankConnection)
      .execute({ userId, connectionId: connection.props.connectionId });
    await container.get(DeleteUser).execute({ userId });
  });

  it('Should succeed on a valid signin with third party auth', async () => {
    const userId = 'azenalzuhgel';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);
    const connection = await container.get(SignIn).execute(payloadSignIn(userId, stateCase.DECOUPLED));

    const payloadSCAInApp = {
      connectionId: connection.props.connectionId,
    };

    await request(app)
      .post('/aggregation/auth/sca')
      .set('authorization', 'Bearer ' + userToken)
      .send(payloadSCAInApp)
      .expect(200)
      .expect(({ body: connection }) => {
        expect(connection.connectionId).toEqual(payloadSCAInApp.connectionId);
        expect(connection.state).toEqual(ConnectionStateEnum.VALIDATING);
        expect(connection.active).toBeTruthy();
        expect(connection.form).toBeFalsy();
      });
    await container
      .get(DeleteBankConnection)
      .execute({ userId, connectionId: connection.props.connectionId });
    await container.get(DeleteUser).execute({ userId });
  });

  it('Should throw bank connection not found', async () => {
    const userId = 'azenalzuhgel';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);
    await container.get(SignIn).execute(payloadSignIn(userId, stateCase.DECOUPLED));

    const payloadSCAInApp = {
      connectionId: 'FAKE_CONNECTION_ID',
    };

    await request(app)
      .post('/aggregation/auth/sca')
      .set('authorization', 'Bearer ' + userToken)
      .send(payloadSCAInApp)
      .expect(404)
      .expect(({ body: error }) => {
        expect(error).toEqual({
          error: 'BankConnectionNotFound',
          code: 'BANK_CONNECTION_NOT_FOUND',
        });
      });

    await container.get(DeleteUser).execute({ userId });
  });

  it('Should throw bad request', async () => {
    const userId = 'haliuzehaze';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);
    const payload = {
      bankId: '338178e6-3d01-564f-9a7b-52ca442459bf',
    };

    await request(app)
      .post('/aggregation/auth/signin')
      .set('authorization', 'Bearer ' + userToken)
      .send(payload)
      .expect(400);
  });

  it('Should throw action needed', async () => {
    const userId = 'azenalzuhgel';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);

    await request(app)
      .post('/aggregation/auth/signin')
      .set('authorization', 'Bearer ' + userToken)
      .send(payloadSignIn(userId, stateCase.ACTION_NEEDED))
      .expect(400)
      .expect(({ body: error }) => {
        expect(error).toEqual({
          error: 'ActionNeeded',
          code: 'ACTION_NEEDED',
          cause: {
            code: 'actionNeeded',
            message: 'Please confirm the new terms and conditions',
          },
        });
      });
  });

  it('Should throw wrong password', async () => {
    const userId = 'azeazqsdaze';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);

    await request(app)
      .post('/aggregation/auth/signin')
      .set('authorization', 'Bearer ' + userToken)
      .send(payloadSignIn(userId, stateCase.WRONG_PASSWORD))
      .expect(400)
      .expect(({ body: error }) => {
        expect(error).toEqual({
          error: 'WrongPassword',
          code: 'WRONG_PASSWORD',
          cause: {
            code: 'wrongpass',
            message: 'Incorrect password',
          },
        });
      });
  });

  it('Should throw ApiResponseError', async () => {
    const userId = 'azeabljhgg';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);

    await request(app)
      .post('/aggregation/auth/signin')
      .set('authorization', 'Bearer ' + userToken)
      // eslint-disable-next-line
      // @ts-ignore
      .send(payloadSignIn(userId, 'azeuoaze'))
      .expect(424)
      .expect(({ body: error }) => {
        expect(error).toEqual(
          expect.objectContaining({
            error: 'ApiResponseError',
            code: 'API_RESPONSE_ERROR',
          }),
        );
      });
  });

  it('Should throw BadRequest if malformed url_callback is given in sca body', async () => {
    const userId = 'azjenluhuytoity';
    const userToken = await getUserToken(container, userId);
    await createUser(container, userId);
    const connection = await container.get(SignIn).execute(payloadSignIn(userId, stateCase.DECOUPLED));

    const payloadSCAInApp = {
      connectionId: connection.props.connectionId,
      form: [
        {
          name: 'url_callback',
          value: 'malformed_url',
        },
      ],
    };

    await request(app)
      .post('/aggregation/auth/sca')
      .set('authorization', 'Bearer ' + userToken)
      .send(payloadSCAInApp)
      .expect(400)
      .expect(({ body: error }) => {
        expect(error).toEqual(
          expect.objectContaining({
            error: 'FieldValidationFailure',
            code: 'FIELD_VALIDATION_FAILURE',
          }),
        );
      });
    await container
      .get(DeleteBankConnection)
      .execute({ userId, connectionId: connection.props.connectionId });
    await container.get(DeleteUser).execute({ userId });
  });
});
