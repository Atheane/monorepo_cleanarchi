import { EncodeIdentity, IdentityProvider, ServiceName } from '@oney/identity-core';
import { ProfileGenerator } from '@oney/profile-adapters';
import { ProfileStatus } from '@oney/profile-messages';
import * as express from 'express';
import { Application } from 'express';
import { Container } from 'inversify';
import * as request from 'supertest';
import { getServiceHolderIdentity } from '@oney/identity-adapters';
import * as nock from 'nock';
import * as path from 'path';
import { configureApp, initRouter } from '../config/server/express';
import { ProfileMapper } from '../modules/mappers/ProfileMapper';

const app: Application = express();

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

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/createProfile`);
nockBack.setMode('record');

describe('Profile integration api testing', () => {
  let userToken: string;
  let container: Container;
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/env/test.env');
    container = await configureApp(envPath, true);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    await initRouter(app, envPath);
  });

  beforeEach(() => nock.enableNetConnect(/127\.0\.0\.1/));

  it('Should return user', async () => {
    const tipsDb = container.get(ProfileGenerator);
    const identityEncode = container.get(EncodeIdentity);
    const userMapperFromDomain = container.get(ProfileMapper);
    const tipsUser = await tipsDb.generate('toto', ProfileStatus.ON_HOLD);
    const userFromDomain = userMapperFromDomain.fromDomain(tipsUser);
    userToken = await identityEncode.execute({
      uid: tipsUser.id,
      email: tipsUser.props.email,
      provider: IdentityProvider.odb,
    });
    await request(app)
      .get('/profile/user/toto')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
      .expect(res => {
        expect({
          ...res.body,
          contract_signed_at: new Date(res.body.contract_signed_at),
          profile: {
            ...res.body.profile,
            birth_date: new Date(res.body.profile.birth_date),
          },
        }).toMatchObject(userFromDomain);
      });
  });

  it('Should return error cause user does not exist', async () => {
    const tipsDb = container.get(ProfileGenerator);
    const identityEncode = container.get(EncodeIdentity);
    const tipsUser = await tipsDb.generate('toto', ProfileStatus.ON_HOLD);
    userToken = await identityEncode.execute({
      uid: 'tata',
      email: tipsUser.props.email,
      provider: IdentityProvider.odb,
    });
    await request(app)
      .get('/profile/user/tata')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(404)
      .expect(res => {
        expect(res.body.message).toEqual('PROFILE_NOT_FOUND');
      });
  });

  it('Should return error cause user token does not match uid', async () => {
    const tipsDb = container.get(ProfileGenerator);
    const identityEncode = container.get(EncodeIdentity);
    const tipsUser = await tipsDb.generate('toto', ProfileStatus.ON_HOLD);
    userToken = await identityEncode.execute({
      uid: 'tata',
      email: tipsUser.props.email,
      provider: IdentityProvider.odb,
    });
    await request(app).get('/profile/user/toto').set('Authorization', `Bearer ${userToken}`).expect(401);
  });

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

  it('Should return 401 cause user is not authorize to create profile', async () => {
    const { nockDone } = await nockBack('createProfileWithDigitalIdentityNotFound.json');
    nock.enableNetConnect(/127\.0\.0\.1/);
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
