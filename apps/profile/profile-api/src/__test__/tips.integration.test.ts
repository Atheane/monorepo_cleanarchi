import { EncodeIdentity, IdentityProvider } from '@oney/identity-core';
import { ProfileGenerator } from '@oney/profile-adapters';
import { TipsServiceProviders } from '@oney/profile-core';
import { ProfileStatus } from '@oney/profile-messages';
import { Application } from 'express';
import * as express from 'express';
import { Container } from 'inversify';
import * as request from 'supertest';
import * as nock from 'nock';
import * as path from 'path';
import { configureApp, initRouter } from '../config/server/express';

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

describe('Tips integration api testing', () => {
  let userToken: string;
  let container: Container;

  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/env/test.env');
    container = await configureApp(envPath, true);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    await initRouter(app, envPath);
  });

  it('Should return tips', async () => {
    nock.enableNetConnect(/127\.0\.0\.1/);
    const tipsDb = container.get(ProfileGenerator);
    const identityEncode = container.get(EncodeIdentity);
    const tipsUser = await tipsDb.generate('toto', ProfileStatus.ON_HOLD);
    userToken = await identityEncode.execute({
      uid: tipsUser.id,
      provider: IdentityProvider.odb,
      email: tipsUser.props.email,
    });
    await request(app)
      .get('/profile/tips/toto')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
      .expect(response => {
        expect(response.body.provider).toEqual(TipsServiceProviders.odb);
        expect(response.body.details).toBeTruthy();
      });
  });

  it('Should return 404 with no tips', async () => {
    nock.enableNetConnect(/127\.0\.0\.1/);
    const scope = nock('https://lily-api.azure-api.net');
    scope.post('/recommendations/query-recommender').reply(200, {
      originalSourceId: '',
      erreur: "Ce userId n'existe pas et vient d'être créé. Merci de rafraichir [DEV/UAT]",
    });
    const tipsDb = container.get(ProfileGenerator);
    const identityEncode = container.get(EncodeIdentity);
    const tipsUser = await tipsDb.generate('werwer', ProfileStatus.ACTIVE);
    userToken = await identityEncode.execute({
      uid: tipsUser.id,
      provider: IdentityProvider.odb,
      email: tipsUser.props.email,
    });
    await request(app).get('/profile/tips/werwer').set('Authorization', `Bearer ${userToken}`).expect(404);
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
      .get('/profile/tips/tata')
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
    await request(app).get('/profile/tips/toto').set('Authorization', `Bearer ${userToken}`).expect(401);
  });
});
