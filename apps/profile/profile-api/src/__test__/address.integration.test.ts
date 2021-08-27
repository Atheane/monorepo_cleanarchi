import { ProfileGenerator } from '@oney/profile-adapters';
import { Steps } from '@oney/profile-core';
import * as express from 'express';
import { Container } from 'inversify';
import * as nock from 'nock';
import * as request from 'supertest';
import * as queryString from 'querystring';
import * as path from 'path';
import { configureApp, initRouter } from '../config/server/express';
import { AddressCommand } from '../modules/onboarding/commands/AddressCommand';

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/address`);
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

const app: express.Application = express();

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

describe('Address integration api testing', () => {
  const userToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVzZXIiOnsidWlkIjoiQVd6Y2xQRnlOIiwiZW1haWwiOiJvenpqQHlvcG1haWwuY29tIn19LCJwcm92aWRlciI6Im9kYiIsInJvbGVzIjpbeyJzY29wZSI6eyJuYW1lIjoicHJvZmlsZSJ9LCJwZXJtaXNzaW9ucyI6eyJ3cml0ZSI6InNlbGYiLCJyZWFkIjoic2VsZiJ9fSx7InNjb3BlIjp7Im5hbWUiOiJhZ2dyZWdhdGlvbiJ9LCJwZXJtaXNzaW9ucyI6eyJ3cml0ZSI6InNlbGYiLCJyZWFkIjoic2VsZiJ9fSx7InNjb3BlIjp7Im5hbWUiOiJub3RpZmljYXRpb25zIn0sInBlcm1pc3Npb25zIjp7IndyaXRlIjoibm8iLCJyZWFkIjoic2VsZiJ9fSx7InNjb3BlIjp7Im5hbWUiOiJjcmVkaXQifSwicGVybWlzc2lvbnMiOnsid3JpdGUiOiJzZWxmIiwicmVhZCI6InNlbGYifX0seyJzY29wZSI6eyJuYW1lIjoiYXV0aGVudGljYXRpb24ifSwicGVybWlzc2lvbnMiOnsid3JpdGUiOiJzZWxmIiwicmVhZCI6InNlbGYifX0seyJzY29wZSI6eyJuYW1lIjoicGF5bWVudCJ9LCJwZXJtaXNzaW9ucyI6eyJ3cml0ZSI6InNlbGYiLCJyZWFkIjoic2VsZiJ9fSx7InNjb3BlIjp7Im5hbWUiOiJhY2NvdW50In0sInBlcm1pc3Npb25zIjp7IndyaXRlIjoic2VsZiIsInJlYWQiOiJzZWxmIn19XSwibmFtZSI6Im9kYiIsImlhdCI6MTYxMTA2ODY4MH0.jP4sPkYUl1Rrux-yfBU7ItTwHWDGFid0lU9RVR1H5gw';
  let container: Container;
  let userId: string;

  beforeAll(async () => {
    userId = 'AWzclPFyN';
    const envPath = path.resolve(__dirname + '/env/test.env');
    container = await configureApp(envPath, true);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    await initRouter(app, envPath);
  });

  it('Should complete Address Step with success', async () => {
    const { nockDone } = await nockBack('completeAddressStep.json', { before });
    nock.enableNetConnect(/127\.0\.0\.1/);
    const profileDb = container.get(ProfileGenerator);
    await profileDb.beforeAddressStepSnapshot(userId);
    const addressCommand: AddressCommand = {
      street: 'Rue saint domingue',
      additionalStreet: 'appartement 00',
      postalCode: '00000',
      city: 'Muerta Island',
      country: 'MI',
    };
    await request(app)
      .post('/profile/AWzclPFyN/onboarding/step/address')
      .set('Authorization', `Bearer ${userToken}`)
      .send(addressCommand)
      .expect(response => {
        expect(response.body.steps.includes(Steps.ADDRESS_STEP)).toBeFalsy();
      });

    await nockDone();
  });
});
