import MockDate from 'mockdate';
import { ProfileGenerator } from '@oney/profile-adapters';
import { Identifiers, ProfileRepositoryRead } from '@oney/profile-core';
import * as express from 'express';
import { Application } from 'express';
import { Container } from 'inversify';
import * as nock from 'nock';
import * as request from 'supertest';
import { EncodeIdentity, IdentityProvider } from '@oney/identity-core';
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

describe('Update consents integration api testing', () => {
  let container: Container;
  let userId: string;
  let userToken: string;
  let wrongUserToken: string;
  let encodeIdentity: EncodeIdentity;
  let saveFixture: Function;

  beforeAll(async () => {
    const email = 'ozzj@yopmail.com';
    userId = 'AWzclPFyN';
    const envPath = path.resolve(__dirname + '/env/test.env');
    container = await configureApp(envPath, true);
    encodeIdentity = container.get(EncodeIdentity);
    userToken = await encodeIdentity.execute({
      provider: IdentityProvider.odb,
      email,
      uid: userId,
    });
    wrongUserToken = await encodeIdentity.execute({
      provider: IdentityProvider.odb,
      email,
      uid: 'none',
    });
    container.bind(ProfileGenerator).to(ProfileGenerator);
    await initRouter(app, envPath);
    const profileDb = container.get(ProfileGenerator);
    await profileDb.cpompletedOnboardingSnapshot(userId, email);
  });

  beforeEach(async () => {
    MockDate.set(new Date('2021-04-01T00:00:00.000Z'));
    nock.restore();
    nock.activate();
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/updateConsents`);
    nock.back.setMode('record');
    const { nockDone } = await nock.back(test.getFixtureName());
    saveFixture = nockDone;
  });

  afterEach(() => {
    MockDate.reset();
    const nockObjects = nock.recorder.play();
    if (nockObjects.length == 0) {
      nock.restore();
    } else {
      console.log('saving nock fixture for: ', test.getFixtureName());
      saveFixture();
    }
  });

  it('Should update consent without optional the fields', async () => {
    nock.enableNetConnect(/(localhost|127\.0\.0\.1)/);
    const res = await request(app)
      .put(`/profile/user/${userId}/consents`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        oney_cnil: true,
        partners_cnil: true,
      })
      .expect(200);

    const updatedProfile = await container
      .get<ProfileRepositoryRead>(Identifiers.profileRepositoryRead)
      .getUserById(userId);
    const expectedResponse = new ProfileMapper().fromDomain(updatedProfile);
    expect(res.body.consents).toEqual(expectedResponse.consents);
  });

  it('Should update consent with optional the fields', async () => {
    nock.enableNetConnect(/(localhost|127\.0\.0\.1)/);
    const res = await request(app)
      .put(`/profile/user/${userId}/consents`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        oney_cnil: true,
        oney_len: true,
        partners_cnil: true,
        partners_len: true,
      })
      .expect(200);

    const updatedProfile = await container
      .get<ProfileRepositoryRead>(Identifiers.profileRepositoryRead)
      .getUserById(userId);
    const expectedResponse = new ProfileMapper().fromDomain(updatedProfile);
    expect(res.body.consents).toEqual(expectedResponse.consents);
  });

  it('Should fail if the mandatory fields are not set', async () => {
    nock.enableNetConnect(/(localhost|127\.0\.0\.1)/);
    await request(app)
      .put(`/profile/user/${userId}/consents`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({})
      .expect(400)
      .expect({
        message: "You have an error in your request's body. Check 'errors' field for more details!",
        errors: [
          {
            target: {},
            property: 'oney_cnil',
            children: [],
            constraints: { isBoolean: 'oney_cnil must be a boolean value' },
          },
          {
            target: {},
            property: 'partners_cnil',
            children: [],
            constraints: { isBoolean: 'partners_cnil must be a boolean value' },
          },
        ],
      });
  });

  it('Should fail if no authorization header is set', async () => {
    nock.enableNetConnect(/(localhost|127\.0\.0\.1)/);
    await request(app).put(`/profile/user/${userId}/consents`).send({}).expect(401).expect({});
  });

  it('Should fail if the usertoken do not match with the request uid', async () => {
    nock.enableNetConnect(/(localhost|127\.0\.0\.1)/);
    await request(app)
      .put(`/profile/user/${userId}/consents`)
      .set('Authorization', `Bearer ${wrongUserToken}`)
      .send({
        oney_cnil: true,
        oney_len: true,
        partners_cnil: true,
        partners_len: true,
      })
      .expect(401);
  });
});
