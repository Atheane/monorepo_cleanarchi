import { EncodeIdentity, IdentityProvider } from '@oney/identity-core';
import { ProfileGenerator } from '@oney/profile-adapters';
import { ProfileProperties, Steps } from '@oney/profile-core';
import { Application } from 'express';
import * as express from 'express';
import { Container } from 'inversify';
import * as nock from 'nock';
import * as request from 'supertest';
import { ProfileStatus } from '@oney/profile-messages';
import * as path from 'path';
import { ProfileFacematchGenerator } from './fixtures/ProfileGenerator';
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

describe('Facematch integration api testing', () => {
  let userToken: string;
  let container: Container;
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/env/test.env');
    container = await configureApp(envPath, true);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    container.bind(ProfileFacematchGenerator).to(ProfileFacematchGenerator);
    await initRouter(app, envPath);
  });

  beforeEach(() => nock.enableNetConnect(/127\.0\.0\.1/));

  it('Should return error cause user token does not match uid', async () => {
    const profileDb = container.get(ProfileGenerator);
    const identityEncode = container.get(EncodeIdentity);
    const user = await profileDb.generate('ttfacematch', ProfileStatus.ON_HOLD);
    userToken = await identityEncode.execute({
      uid: 'wrong',
      email: user.props.email,
      provider: IdentityProvider.odb,
    });
    await request(app)
      .post('/profile/ttfacematch/onboarding/step/facematch')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        customerRank: 0,
        selfieConsent: true,
        selfieConsentDate: new Date(),
        result: 'stop',
        msg: 'test message',
      })
      .expect(401);
  });

  it('Should return error when invalid body', async () => {
    const profileDb = container.get(ProfileGenerator);
    const identityEncode = container.get(EncodeIdentity);
    const user = await profileDb.generate('ttfacematch', ProfileStatus.ON_HOLD);
    userToken = await identityEncode.execute({
      uid: user.id,
      email: user.props.email,
      provider: IdentityProvider.odb,
    });
    await request(app)
      .post('/profile/ttfacematch/onboarding/step/facematch')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(400);
  });

  it('Should return 404 when Oneytrust folder non existant', async () => {
    nock('https://pad-staging.api-ot.com/api/v2').post('/selfieoutcome').reply(404);

    const profileDb = container.get(ProfileGenerator);
    const identityEncode = container.get(EncodeIdentity);
    const user = await profileDb.generate('ttfacematch', ProfileStatus.ON_HOLD);
    userToken = await identityEncode.execute({
      uid: user.id,
      email: user.props.email,
      provider: IdentityProvider.odb,
    });
    await request(app)
      .post('/profile/ttfacematch/onboarding/step/facematch')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        result: 'skipped',
      })
      .expect(404)
      .expect(res => {
        expect(res.text).toBeDefined();
      });
  });

  it('Should return 410 when Oneytrust acquisition timeout is match', async () => {
    const profileDb = container.get(ProfileGenerator);
    const identityEncode = container.get(EncodeIdentity);
    const user = await profileDb.generate(
      'ttfacematch',
      ProfileStatus.ON_HOLD,
      'SP_202118_ujHGEuTJO_0YOY0Whiv',
    );
    userToken = await identityEncode.execute({
      uid: user.id,
      email: user.props.email,
      provider: IdentityProvider.odb,
    });
    nock('https://pad-staging.api-ot.com/api/v2').post('/selfieoutcome').reply(410);
    await request(app)
      .post('/profile/ttfacematch/onboarding/step/facematch')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        result: 'skipped',
      })
      .expect(410)
      .expect(res => {
        expect(res.text).toBeDefined();
      });
  });

  it('Should return 200 when facematch validated', async () => {
    nock('https://pad-staging.api-ot.com/api/v2').post('/selfieoutcome').reply(204);

    const profileDb = container.get(ProfileFacematchGenerator);
    const identityEncode = container.get(EncodeIdentity);
    const facematchUser = await profileDb.generate('okfacematch', ProfileStatus.ON_HOLD);
    userToken = await identityEncode.execute({
      uid: facematchUser.id,
      email: facematchUser.props.email,
      provider: IdentityProvider.odb,
    });
    await request(app)
      .post('/profile/okfacematch/onboarding/step/facematch')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        result: 'skipped',
      })
      .expect(200)
      .expect(res => {
        expect({
          ...res.body,
          informations: {
            ...res.body.informations,
            birthDate: new Date(res.body.informations.birthDate),
          },
          kyc: {
            ...res.body.kyc,
            contractSignedAt: new Date(res.body.kyc.contractSignedAt),
          },
        } as ProfileProperties).toEqual({
          ...facematchUser.props,
          kyc: {
            ...facematchUser.props.kyc,
            steps: [
              Steps.PHONE_STEP,
              Steps.IDENTITY_DOCUMENT_STEP,
              Steps.ADDRESS_STEP,
              Steps.CIVIL_STATUS_STEP,
              Steps.FISCAL_STATUS_STEP,
              Steps.CONTRACT_STEP,
            ],
          },
        } as ProfileProperties);
      });
  });

  it('Should return 200 with non optionnal payload values', async () => {
    nock('https://pad-staging.api-ot.com/api/v2').post('/selfieoutcome').reply(204);

    const profileDb = container.get(ProfileFacematchGenerator);
    const identityEncode = container.get(EncodeIdentity);
    const facematchUser = await profileDb.generate('okfacematch', ProfileStatus.ON_HOLD);
    userToken = await identityEncode.execute({
      uid: facematchUser.id,
      email: facematchUser.props.email,
      provider: IdentityProvider.odb,
    });
    await request(app)
      .post('/profile/okfacematch/onboarding/step/facematch')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        customerRank: 1234,
        selfieConsent: false,
        selfieConsentDate: new Date(),
        result: 'skipped',
        msg: 'test',
      })
      .expect(200)
      .expect(res => {
        expect({
          ...res.body,
          informations: {
            ...res.body.informations,
            birthDate: new Date(res.body.informations.birthDate),
          },
          kyc: {
            ...res.body.kyc,
            contractSignedAt: new Date(res.body.kyc.contractSignedAt),
          },
        } as ProfileProperties).toEqual({
          ...facematchUser.props,
          kyc: {
            ...facematchUser.props.kyc,
            steps: [
              Steps.PHONE_STEP,
              Steps.IDENTITY_DOCUMENT_STEP,
              Steps.ADDRESS_STEP,
              Steps.CIVIL_STATUS_STEP,
              Steps.FISCAL_STATUS_STEP,
              Steps.CONTRACT_STEP,
            ],
          },
        } as ProfileProperties);
      });
  });

  it('Should return 200 without calling Oneytrust', async () => {
    const profileDb = container.get(ProfileFacematchGenerator);
    const identityEncode = container.get(EncodeIdentity);
    const facematchUser = await profileDb.generate('okfacematch', ProfileStatus.ON_HOLD);
    userToken = await identityEncode.execute({
      uid: facematchUser.id,
      email: facematchUser.props.email,
      provider: IdentityProvider.odb,
    });
    await request(app)
      .post('/profile/okfacematch/onboarding/step/facematch')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        result: 'ok',
      })
      .expect(200)
      .expect(res => {
        expect({
          ...res.body,
          informations: {
            ...res.body.informations,
            birthDate: new Date(res.body.informations.birthDate),
          },
          kyc: {
            ...res.body.kyc,
            contractSignedAt: new Date(res.body.kyc.contractSignedAt),
          },
        } as ProfileProperties).toEqual({
          ...facematchUser.props,
          kyc: {
            ...facematchUser.props.kyc,
            steps: [
              Steps.PHONE_STEP,
              Steps.IDENTITY_DOCUMENT_STEP,
              Steps.ADDRESS_STEP,
              Steps.CIVIL_STATUS_STEP,
              Steps.FISCAL_STATUS_STEP,
              Steps.CONTRACT_STEP,
            ],
          },
        } as ProfileProperties);
      });
  });
});
