import 'reflect-metadata';
import {
  AuthIdentifier,
  AuthStatus,
  Channel,
  Email,
  User,
  UserProperties,
  UserRepository,
} from '@oney/authentication-core';
import { DecodeIdentity } from '@oney/identity-core';
import { Application } from 'express';
import * as express from 'express';
import * as request from 'supertest';
import * as path from 'path';
import { bootstrap } from './fixtures/bootstrap';
import { AppKernel } from '../config/di/AppKernel';

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

describe('Auth integration api testing', () => {
  let container: AppKernel;
  let scaToken: string;
  let user: User;
  let secondUser: User;
  let decodeIdentity: DecodeIdentity;
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/env/test.env');
    container = await bootstrap(envPath, process.env.MONGO_URL, process.env.MONGO_DB_NAME, app);

    user = new User({
      email: Email.from('hello@hello.com'),
      uid: '12345689',
      pinCode: null,
      phone: null,
    });
    const userRepository = container.get<UserRepository>(AuthIdentifier.userRepository);
    await userRepository.save(user);
    secondUser = new User({
      email: Email.from('goodbye@hello.com'),
      uid: '987654321',
      pinCode: null,
      phone: null,
    });
    await userRepository.save(secondUser);
    decodeIdentity = container.get(DecodeIdentity);
  });

  it('Should trigger SCA via /auth/signin', async () => {
    // GIVEN
    const { address } = user.props.email;
    const payload = {
      email: address,
    };

    // WHEN
    return request(app)
      .post('/authentication/auth/signin')
      .send(payload)
      .expect(403)
      .expect(response => {
        const { body } = response;
        scaToken = response.header.sca_token;
        expect(body.status).toMatch(AuthStatus.PENDING);
        expect(body.valid).toBeFalsy();
        expect(body.action.type).toEqual('SIGN_IN');
        expect(body.channel).toMatch(Channel.EMAIL);
      });
  });

  it('Should get 401 cause verifier not valid via /auth/signin', async () => {
    // GIVEN
    const { address } = user.props.email;
    const payload = {
      email: address,
    };

    // WHEN
    return request(app)
      .post('/authentication/auth/signin')
      .send(payload)
      .set('sca_token', scaToken)
      .expect(401);
  });

  it('Should send a 401 cause email not found /auth/signin', async () => {
    // GIVEN
    const payload = {
      email: 'iamthenotfound@404.com',
    };

    // WHEN
    return request(app).post('/authentication/auth/signin').send(payload).expect(404);
  });

  it('Should verify auth based on sca_token sent earlier', async () => {
    // GIVEN
    const credentials = {
      credentials: '00000000',
    };

    return request(app)
      .post('/authentication/sca/verify')
      .set('sca_token', scaToken)
      .send(credentials)
      .expect(200)
      .expect(response => {
        // Then
        expect(response.body).toBeTruthy();
      });
  });

  it('Should retrieve user_token base on successfully authentication', async () => {
    // GIVEN
    const { address } = user.props.email;
    const payload = {
      email: address,
    };

    // WHEN
    return request(app)
      .post('/authentication/auth/signin')
      .set('sca_token', scaToken)
      .send(payload)
      .expect(200)
      .expect(async response => {
        console.log(response.header.user_token);
        const userToken = await decodeIdentity.execute({
          holder: response.header.user_token,
        });
        const userResponse: UserProperties = response.body;
        expect(userResponse.pinCode.isSet).toBeFalsy();
        expect(userResponse.uid).toEqual(user.props.uid);
        expect(userResponse.phone).toBeFalsy();
        expect(userToken.uid).toEqual(userResponse.uid);
        expect(userToken.email).toEqual(payload.email);
      });
  });

  it('Should reject with 403 cause i cant validate operation more than one time', () =>
    request(app)
      .post('/authentication/auth/signin')
      .set('sca_token', scaToken)
      .send({ email: user.props.email.address })
      .expect(403)
      .expect(response => {
        expect(response.body).toBeTruthy();
        expect(response.body.action.consumedAt).not.toBeNull();
      }));

  it('Should reject with 409 cause i cant validate operation with a different body', () =>
    request(app)
      .post('/authentication/auth/signin')
      .set('sca_token', scaToken)
      .send({ email: secondUser.props.email.address })
      .expect(409));
});
