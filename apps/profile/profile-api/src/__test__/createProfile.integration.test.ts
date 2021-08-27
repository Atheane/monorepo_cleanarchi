import { EncodeIdentity, IdentityProvider, ServiceName } from '@oney/identity-core';
import { ProfileGenerator } from '@oney/profile-adapters';
import * as express from 'express';
import { Application } from 'express';
import { Container } from 'inversify';
import * as request from 'supertest';
import * as nock from 'nock';
import { getServiceHolderIdentity } from '@oney/identity-adapters';
import * as path from 'path';
import { configureApp, initRouter } from '../config/server/express';

const app: Application = express();
const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/createProfile`);

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

describe('Create Profile integration api testing', () => {
  let userToken: string;
  let container: Container;
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/env/test.env');
    container = await configureApp(envPath, true);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    await initRouter(app, envPath);
  });

  beforeEach(() => nock.enableNetConnect(/127\.0\.0\.1/));

  it('Should create a profile', async () => {
    const { nockDone } = await nockBack('createProfileWithDigitalIdentityNotFound.json');
    nock.enableNetConnect(/127\.0\.0\.1/);
    const authorizeToken = await getServiceHolderIdentity(container, ServiceName.authentication);
    await request(app)
      .post('/profile/user')
      .set('Authorization', `Bearer ${authorizeToken}`)
      .send({
        email: 'IdentityNotFound@yopmail.com',
        uid: 'poazek',
      })
      .expect(201);
    await nockDone();
  });

  it('Should get a 400 cause phone is invalid', async () => {
    const authorizeToken = await getServiceHolderIdentity(container, ServiceName.authentication);
    await request(app)
      .post('/profile/user')
      .set('Authorization', `Bearer ${authorizeToken}`)
      .send({
        email: 'IdentityNotFound@yopmail.com',
        uid: 'poazek',
        phone: 'azeaze',
      })
      .expect(400);
  });

  it('Should return 401 cause user is not authorize to create profile', async () => {
    const { nockDone } = await nockBack('createProfileWithDigitalIdentityNotFound.json');
    const identityEncode = container.get(EncodeIdentity);
    userToken = await identityEncode.execute({
      uid: 'poazek',
      email: 'IdentityNotFound@yopmail.com',
      provider: IdentityProvider.odb,
    });
    await request(app)
      .post('/profile/user')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        email: 'IdentityNotFound@yopmail.com',
        uid: 'poazek',
      })
      .expect(401);
    await nockDone();
  });
});
