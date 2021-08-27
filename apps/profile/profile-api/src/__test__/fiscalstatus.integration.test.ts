import { ProfileGenerator } from '@oney/profile-adapters';
import { Steps } from '@oney/profile-core';
import { Application } from 'express';
import * as express from 'express';
import { Container } from 'inversify';
import * as nock from 'nock';
import * as request from 'supertest';
import * as path from 'path';
import { configureApp, initRouter } from '../config/server/express';

const app: Application = express();

const otScope = nock('https://api-staging.oneytrust.com');

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

jest.mock('jsonwebtoken', () => ({
  sign: jest
    .fn()
    .mockReturnValue(
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjE1MTIwNDgzLWE4ZjgtNDViMS05N2JiLWU0ZGQ4NzZiNTlhMCJ9.eyJmbG93c3RlcHMiOlsiU0NBX0lOQVBQIl0sImNsaWVudF9pZCI6IlBUQUlMX0JRX0RJR0lUIiwiaWRlbnRpZmllcnMiOlt7ImlkIjoiTkdGT0hGeDhVc3JybldtbllDZWJRYjdxcXNFQjNaVWdfNkNMUzNFTVZIUGFNUDFhIiwidHlwZSI6IkZQIn1dLCJpYXQiOjE2MTEyNTA2MjgsImV4cCI6MTYxMzg0MjYyOCwiaXNzIjoiT0RCIiwic3ViIjoiaW5vaWQxMDAzODc1NzE2In0.b1sQOFeaMER3z8Xc-rmRWLzNdQboaZzHFoGdNGh55lCd3vaNdYDqpeiOoD3lSaZmOfbw1N8URxqB1by7cPVJhGmTO38vtn-UiYL5pu3Qoj1862dq5krM2es8X7FzUdW9Jn7kxTbmYCA8vb0pX5oVHgipDD_uHTzqAOBPYw6QygU',
    ),
  decode: jest.fn().mockReturnValue({
    provider: 'odb',
  }),
  verify: jest.fn().mockReturnValue({
    payload: {
      user: {
        uid: 'ow_KFDTZq',
        email: 'ozzj@yopmail.com',
      },
    },
    provider: 'odb',
    roles: [
      {
        scope: {
          name: 'profile',
        },
        permissions: {
          write: 'self',
          read: 'self',
        },
      },
    ],
    name: 'odb',
    iat: 1611068680,
  }),
}));

describe('FiscalStatus integration api testing', () => {
  const userToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVzZXIiOnsidWlkIjoib3dfS0ZEVFpxIiwiZW1haWwiOiJvenpqQHlvcG1haWwuY29tIn19LCJwcm92aWRlciI6Im9kYiIsInJvbGVzIjpbeyJzY29wZSI6eyJuYW1lIjoicHJvZmlsZSJ9LCJwZXJtaXNzaW9ucyI6eyJ3cml0ZSI6InNlbGYiLCJyZWFkIjoic2VsZiJ9fV0sIm5hbWUiOiJvZGIiLCJpYXQiOjE2MTEwNjg2ODB9.hkFJiB24FOabZGrAfYbDq5pMwYZ6jz87tH1vUtA6f5s';
  let container: Container;
  let userId: string;

  beforeAll(async () => {
    userId = 'ow_KFDTZq';
    const envPath = path.resolve(__dirname + '/env/test.env');
    container = await configureApp(envPath, true);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    await initRouter(app, envPath);
  });

  beforeEach(() => nock.enableNetConnect(/127\.0\.0\.1/));

  it('Should request fiscalStatus with success', async () => {
    const profileDb = container.get(ProfileGenerator);
    const profile = await profileDb.beforeAddressStepSnapshot(userId);
    /* ToDo: replace by nockBack */
    const scope = nock('http://localhost:3022').patch(`/payment/user/${userId}`).reply(200);
    otScope.patch(`/tulipe/v2/3000001341/cases/${profile.props.kyc.caseReference}/form-data`).reply(202);
    otScope.post(`/tulipe/v2/3000001341/cases/${profile.props.kyc.caseReference}/analysis`).reply(202);
    await request(app)
      .post('/profile/ow_KFDTZq/onboarding/step/fiscalStatus')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        fiscalReference: {
          country: 'FR',
          fiscalNumber: '123456',
        },
        declarativeFiscalSituation: {
          income: '1',
          economicActivity: '11',
        },
      })
      .expect(200)
      .expect(response => {
        expect(response.body.steps.includes(Steps.FISCAL_STATUS_STEP)).toBeFalsy();
      });
    otScope.done();
    scope.done();
  });

  it('Should request fail if the uid in params and token does not match', async () => {
    const profileDb = container.get(ProfileGenerator);
    await profileDb.beforeCivilStatusSnapshot(userId);
    await request(app)
      .post('/profile/otherid/onboarding/step/fiscalStatus')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        fiscalReference: {
          country: 'FR',
          fiscalNumber: '123456',
        },
        declarativeFiscalSituation: {
          income: '1',
          economicActivity: '11',
        },
      })
      .expect(403);
  });

  it('Should reject request if the fiscalReference is not provided', async () => {
    const profileDb = container.get(ProfileGenerator);
    await profileDb.beforeCivilStatusSnapshot(userId);
    await request(app)
      .post('/profile/ow_KFDTZq/onboarding/step/fiscalStatus')
      .set('Authorization', `Bearer ${userToken}`)
      .send({})
      .expect(400);
  });

  it('Should reject request if the earningAmount is wrong', async () => {
    const profileDb = container.get(ProfileGenerator);
    await profileDb.beforeCivilStatusSnapshot(userId);
    await request(app)
      .post('/profile/ow_KFDTZq/onboarding/step/fiscalStatus')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        fiscalReference: {
          country: 'FR',
          fiscalNumber: '123456',
        },
      })
      .expect(400);
  });
});
