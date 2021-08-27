import { EncodeIdentity, IdentityProvider } from '@oney/identity-core';
import { ProfileGenerator } from '@oney/profile-adapters';
import { FiscalCountriesList } from '@oney/profile-core';
import { Application } from 'express';
import * as express from 'express';
import { Container } from 'inversify';
import * as request from 'supertest';
import { ProfileStatus } from '@oney/profile-messages';
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

describe('GetFiscalCountriesList integration api testing', () => {
  let userToken: string;
  let container: Container;
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/env/test.env');
    container = await configureApp(envPath, true);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    await initRouter(app, envPath);
  });

  it('Should return error when is user is not authenticated', async () => {
    await request(app)
      .get('/profile/resources/onboarding/step/fiscalstatus/countrieslist')
      .send({})
      .expect(401);
  });

  it('Should return the fiscal countries list', async () => {
    const profileDb = container.get(ProfileGenerator);
    const identityEncode = container.get(EncodeIdentity);
    const facematchUser = await profileDb.generate('okGetFiscalCountriesList', ProfileStatus.ON_HOLD);
    userToken = await identityEncode.execute({
      uid: facematchUser.id,
      email: facematchUser.props.email,
      provider: IdentityProvider.odb,
    });
    await request(app)
      .get('/profile/resources/onboarding/step/fiscalstatus/countrieslist')
      .set('Authorization', `Bearer ${userToken}`)
      .send({})
      .expect(200)
      .expect(res => {
        expect(res.body).toEqual(FiscalCountriesList);
      });
  });
});
