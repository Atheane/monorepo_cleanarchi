import { ProfileGenerator, ShortIdGenerator } from '@oney/profile-adapters';
import {
  BirthDate,
  Identifiers,
  Otp,
  OtpRepositoryWrite,
  ProfileRepositoryRead,
  Steps,
} from '@oney/profile-core';
import * as express from 'express';
import { Application } from 'express';
import { Container } from 'inversify';
import * as nock from 'nock';
import * as request from 'supertest';
import { ProfileStatus } from '@oney/profile-messages';
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

jest.mock('jsonwebtoken', () => ({
  sign: jest
    .fn()
    .mockReturnValue(
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjE1MTIwNDgzLWE4ZjgtNDViMS05N2JiLWU0ZGQ4NzZiNTlhMCJ9.eyJmbG93c3RlcHMiOlsiU0NBX0lOQVBQIl0sImNsaWVudF9pZCI6IlBUQUlMX0JRX0RJR0lUIiwiaWRlbnRpZmllcnMiOlt7ImlkIjoiTkdGT0hGeDhVc3JybldtbllDZWJRYjdxcXNFQjNaVWdfNkNMUzNFTVZIUGFNUDFhIiwidHlwZSI6IkZQIn1dLCJpYXQiOjE2MTEyNTI4MTYsImV4cCI6MTYxMzg0NDgxNiwiaXNzIjoiT0RCIiwic3ViIjoiaW5vaWQxMDAzODc1NzE2In0.H0hlicswSpQ1-xUkirCE-ZQ-ymk5ec0Kh8BZhCUf0zDW-pd0n1lw2kzbehkHFHDt3EHjWQauaXuz6sqK_q7qfzbeuN0kElI4xHQ3FKA-pkfHlrbSWRjmN5xDFBMGfuao_Aroc8YvIKMt98YZvkJZ1Tmxazi27U_KwoC4uvAjKKI',
    ),
  decode: jest.fn().mockReturnValue({
    provider: 'odb',
  }),
  verify: jest.fn().mockReturnValue({
    payload: {
      user: {
        uid: 'QsDfgHjKln',
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

describe('Phone Step integration api testing', () => {
  const userToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVzZXIiOnsidWlkIjoiQVd6Y2xQRnlOIiwiZW1haWwiOiJvenpqQHlvcG1haWwuY29tIn19LCJwcm92aWRlciI6Im9kYiIsInJvbGVzIjpbeyJzY29wZSI6eyJuYW1lIjoicHJvZmlsZSJ9LCJwZXJtaXNzaW9ucyI6eyJ3cml0ZSI6InNlbGYiLCJyZWFkIjoic2VsZiJ9fSx7InNjb3BlIjp7Im5hbWUiOiJhZ2dyZWdhdGlvbiJ9LCJwZXJtaXNzaW9ucyI6eyJ3cml0ZSI6InNlbGYiLCJyZWFkIjoic2VsZiJ9fSx7InNjb3BlIjp7Im5hbWUiOiJub3RpZmljYXRpb25zIn0sInBlcm1pc3Npb25zIjp7IndyaXRlIjoibm8iLCJyZWFkIjoic2VsZiJ9fSx7InNjb3BlIjp7Im5hbWUiOiJjcmVkaXQifSwicGVybWlzc2lvbnMiOnsid3JpdGUiOiJzZWxmIiwicmVhZCI6InNlbGYifX0seyJzY29wZSI6eyJuYW1lIjoiYXV0aGVudGljYXRpb24ifSwicGVybWlzc2lvbnMiOnsid3JpdGUiOiJzZWxmIiwicmVhZCI6InNlbGYifX0seyJzY29wZSI6eyJuYW1lIjoicGF5bWVudCJ9LCJwZXJtaXNzaW9ucyI6eyJ3cml0ZSI6InNlbGYiLCJyZWFkIjoic2VsZiJ9fSx7InNjb3BlIjp7Im5hbWUiOiJhY2NvdW50In0sInBlcm1pc3Npb25zIjp7IndyaXRlIjoic2VsZiIsInJlYWQiOiJzZWxmIn19XSwibmFtZSI6Im9kYiIsImlhdCI6MTYxMTA2ODY4MH0.jP4sPkYUl1Rrux-yfBU7ItTwHWDGFid0lU9RVR1H5gw';
  let container: Container;
  let userId: string;
  let mockedOtp: Otp;

  beforeAll(async () => {
    userId = 'QsDfgHjKln';
    mockedOtp = new Otp({
      uid: userId,
      codeHash: 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      phone: '+33633335552',
      creationAttempts: 1,
    });
    const envPath = path.resolve(__dirname + '/env/test.env');
    container = await configureApp(envPath, true);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    await initRouter(app, envPath);
    const profileDb = container.get(ProfileGenerator);
    await profileDb.generate(userId, ProfileStatus.ON_BOARDING);
  });

  afterEach(async () => {
    await container.get<OtpRepositoryWrite>(Identifiers.otpRepositoryWrite).delete(mockedOtp);
  });

  describe('Validate Phone integration api testing', () => {
    let saveFixture: Function;
    jest
      .spyOn(ShortIdGenerator.prototype, 'generateUniqueID')
      .mockImplementation(() => 'uniqueIdIntegrationTest01');
    jest.spyOn(Date.prototype, 'getFullYear').mockImplementation(() => 2021);
    jest.spyOn(Date.prototype, 'getMonth').mockImplementation(() => 1);
    jest.spyOn(Date.prototype, 'getDate').mockImplementation(() => 4);
    jest.spyOn(BirthDate.prototype, 'validate').mockImplementation(() => true);

    beforeEach(async () => {
      nock.restore();
      nock.activate();
      nock.back.fixtures = path.resolve(`${__dirname}/fixtures/phoneStep`);
      nock.back.setMode('record');
      const { nockDone } = await nock.back(test.getFixtureName());
      saveFixture = nockDone;
    });

    afterEach(() => {
      const nockObjects = nock.recorder.play();
      if (nockObjects.length == 0) {
        nock.restore();
      } else {
        console.log('saving nock fixture for: ', test.getFixtureName());
        saveFixture();
      }
    });

    it('Should complete Phone Step with success', async () => {
      await container.get<OtpRepositoryWrite>(Identifiers.otpRepositoryWrite).save(mockedOtp);
      nock.enableNetConnect(/127\.0\.0\.1/);
      const res = await request(app)
        .post(`/profile/${userId}/onboarding/step/phone/validate`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          code: 'test',
        })
        .expect(200)
        .expect(response => {
          expect(response.body.steps.includes(Steps.PHONE_STEP)).toBeFalsy();
        });

      const updatedProfile = await container
        .get<ProfileRepositoryRead>(Identifiers.profileRepositoryRead)
        .getUserById(userId);
      const expectedResponse = new ProfileMapper().fromDomain(updatedProfile);
      expect(res.body).toEqual({
        ...expectedResponse,
        profile: {
          ...expectedResponse.profile,
          birth_date: expectedResponse.profile.birth_date.toISOString(),
        },
        contract_signed_at: expectedResponse.contract_signed_at.toISOString(),
        facematch_url: expectedResponse.facematch_url,
      });
    });

    it('Should complete Phone Step with generic OTP', async () => {
      jest.spyOn(Date.prototype, 'getDate').mockImplementation(() => 5);
      await container.get<OtpRepositoryWrite>(Identifiers.otpRepositoryWrite).save(mockedOtp);

      nock.enableNetConnect(/127\.0\.0\.1/);
      const res = await request(app)
        .post(`/profile/${userId}/onboarding/step/phone/validate`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          code: '123456',
        })
        .expect(200)
        .expect(response => {
          expect(response.body.steps.includes(Steps.PHONE_STEP)).toBeFalsy();
        });

      const updatedProfile = await container
        .get<ProfileRepositoryRead>(Identifiers.profileRepositoryRead)
        .getUserById(userId);
      const expectedResponse = new ProfileMapper().fromDomain(updatedProfile);
      expect(res.body).toEqual({
        ...expectedResponse,
        profile: {
          ...expectedResponse.profile,
          birth_date: expectedResponse.profile.birth_date.toISOString(),
        },
        contract_signed_at: expectedResponse.contract_signed_at.toISOString(),
      });
    });

    it('Should return error because otp incorrect', async () => {
      await container.get<OtpRepositoryWrite>(Identifiers.otpRepositoryWrite).save(mockedOtp);
      nock.enableNetConnect(/127\.0\.0\.1/);
      await request(app)
        .post(`/profile/${userId}/onboarding/step/phone/validate`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          code: 'wrongOTP',
        })
        .expect(400)
        .expect(response => {
          expect(response.body.code).toEqual('E001_0121');
        });
    });

    it('Should return error because user not authorized', async () => {
      nock.enableNetConnect(/127\.0\.0\.1/);
      await request(app)
        .post(`/profile/WrongUid/onboarding/step/phone/validate`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          code: 'test',
        })
        .expect(401);
    });
  });
});
