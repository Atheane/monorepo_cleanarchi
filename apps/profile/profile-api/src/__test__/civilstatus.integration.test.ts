import { ProfileGenerator } from '@oney/profile-adapters';
import { Profile, Steps } from '@oney/profile-core';
import * as express from 'express';
import { Application } from 'express';
import { Container } from 'inversify';
import * as nock from 'nock';
import * as request from 'supertest';
import * as queryString from 'querystring';
import * as path from 'path';
import { configureApp, initRouter } from '../config/server/express';

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/civilStatus`);
nockBack.setMode('record');

const before = (scope: any) => {
  // eslint-disable-next-line no-param-reassign
  scope.filteringRequestBody = (body: string, aRecordedBody: any) => {
    const { of: currentOffset } = queryString.parse(`?${body}`);
    const { of: recordedOffset } = queryString.parse(`?${body}`);
    if (!(currentOffset || recordedOffset)) {
      // Just replace the saved body by a new one
      // eslint-disable-next-line no-param-reassign
      delete aRecordedBody.orderid;
      return aRecordedBody;
    }
    if (currentOffset === recordedOffset) {
      return aRecordedBody;
    }
    return body;
  };
};

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
        uid: 'AWzclPFyN',
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

describe('CivilStatus integration api testing', () => {
  const userToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVzZXIiOnsidWlkIjoiQVd6Y2xQRnlOIiwiZW1haWwiOiJvenpqQHlvcG1haWwuY29tIn19LCJwcm92aWRlciI6Im9kYiIsInJvbGVzIjpbeyJzY29wZSI6eyJuYW1lIjoicHJvZmlsZSJ9LCJwZXJtaXNzaW9ucyI6eyJ3cml0ZSI6InNlbGYiLCJyZWFkIjoic2VsZiJ9fSx7InNjb3BlIjp7Im5hbWUiOiJhZ2dyZWdhdGlvbiJ9LCJwZXJtaXNzaW9ucyI6eyJ3cml0ZSI6InNlbGYiLCJyZWFkIjoic2VsZiJ9fSx7InNjb3BlIjp7Im5hbWUiOiJub3RpZmljYXRpb25zIn0sInBlcm1pc3Npb25zIjp7IndyaXRlIjoibm8iLCJyZWFkIjoic2VsZiJ9fSx7InNjb3BlIjp7Im5hbWUiOiJjcmVkaXQifSwicGVybWlzc2lvbnMiOnsid3JpdGUiOiJzZWxmIiwicmVhZCI6InNlbGYifX0seyJzY29wZSI6eyJuYW1lIjoiYXV0aGVudGljYXRpb24ifSwicGVybWlzc2lvbnMiOnsid3JpdGUiOiJzZWxmIiwicmVhZCI6InNlbGYifX0seyJzY29wZSI6eyJuYW1lIjoicGF5bWVudCJ9LCJwZXJtaXNzaW9ucyI6eyJ3cml0ZSI6InNlbGYiLCJyZWFkIjoic2VsZiJ9fSx7InNjb3BlIjp7Im5hbWUiOiJhY2NvdW50In0sInBlcm1pc3Npb25zIjp7IndyaXRlIjoic2VsZiIsInJlYWQiOiJzZWxmIn19XSwibmFtZSI6Im9kYiIsImlhdCI6MTYxMTA2ODY4MH0.jP4sPkYUl1Rrux-yfBU7ItTwHWDGFid0lU9RVR1H5gw';
  let container: Container;
  let userId: string;
  let persistedProfile: Profile;
  const civilStatusCommand = {
    gender: '1',
    firstName: 'chalom',
    lastName: 'ellezam',
    birthDate: new Date('1992-11-15').toISOString(),
    birthCity: 'Paris',
    birthCountry: 'FR',
    birthDepartmentCode: '75',
    birthDistrictCode: '01',
    legalName: 'azaeaze',
  };

  beforeAll(async () => {
    userId = 'AWzclPFyN';
    const envPath = path.resolve(__dirname + '/env/test.env');
    container = await configureApp(envPath, true);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    await initRouter(app, envPath);
    const profileDb = container.get(ProfileGenerator);
    persistedProfile = await profileDb.beforeCivilStatusSnapshot(userId);
  });

  it('Should request civilStatus with success', async () => {
    const { nockDone } = await nockBack('completeCivilStatus.json', { before });
    nock.enableNetConnect(/127\.0\.0\.1/);
    await request(app)
      .post('/profile/AWzclPFyN/onboarding/step/civilstatus')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        ...civilStatusCommand,
        nationality: 'BE',
      })
      .expect(200)
      .expect(response => {
        expect(response.body.steps.includes(Steps.CIVIL_STATUS_STEP)).toBeFalsy();
        expect(response.body.profile.nationality).toEqual(
          persistedProfile.props.informations.nationalityCountryCode,
        );
      });
    await nockDone();
  });

  it('Should request civilStatus with non optional values and returns success', async () => {
    const { nockDone } = await nockBack('completeCivilStatus.json', { before });
    nock.enableNetConnect(/127\.0\.0\.1/);
    await request(app)
      .post('/profile/AWzclPFyN/onboarding/step/civilstatus')
      .set('Authorization', `Bearer ${userToken}`)
      .send(civilStatusCommand)
      .expect(200)
      .expect(response => {
        expect(response.body.steps.includes(Steps.CIVIL_STATUS_STEP)).toBeFalsy();
        expect(response.body.profile.nationality).toEqual(
          persistedProfile.props.informations.nationalityCountryCode,
        );
      });
    await nockDone();
  });

  it('Should request civilStatus and return 400 error', async () => {
    await request(app)
      .post('/profile/AWzclPFyN/onboarding/step/civilstatus')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        ...civilStatusCommand,
        birthCountry: 'US',
      })
      .expect(400)
      .expect(response => {
        expect(response.body.code).toEqual('E001_U002');
      });
  });
});
