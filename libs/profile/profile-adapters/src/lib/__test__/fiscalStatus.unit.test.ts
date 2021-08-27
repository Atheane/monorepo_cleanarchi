import 'reflect-metadata';
import { buildProfileAdapterLib, ProfileGenerator } from '@oney/profile-adapters';
import { EarningsThreshold, FiscalStatusStep, Profile, Steps } from '@oney/profile-core';
import { Container } from 'inversify';
import * as nock from 'nock';
import { ServiceBusClient } from '@azure/service-bus';
import MockDate from 'mockdate';
import { config, identityConfig } from './fixtures/config';
import { domainEvent, legacyEvent } from './fixtures/fiscalStatus/events';

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

jest.mock('uuid', () => ({
  v4: () => 'uuid_v4_example',
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest
    .fn()
    .mockReturnValue(
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjE1MTIwNDgzLWE4ZjgtNDViMS05N2JiLWU0ZGQ4NzZiNTlhMCJ9.eyJmbG93c3RlcHMiOlsiU0NBX0lOQVBQIl0sImNsaWVudF9pZCI6IlBUQUlMX0JRX0RJR0lUIiwiaWRlbnRpZmllcnMiOlt7ImlkIjoiTkdGT0hGeDhVc3JybldtbllDZWJRYjdxcXNFQjNaVWdfNkNMUzNFTVZIUGFNUDFhIiwidHlwZSI6IkZQIn1dLCJpYXQiOjE2MTEyNTA2MjgsImV4cCI6MTYxMzg0MjYyOCwiaXNzIjoiT0RCIiwic3ViIjoiaW5vaWQxMDAzODc1NzE2In0.b1sQOFeaMER3z8Xc-rmRWLzNdQboaZzHFoGdNGh55lCd3vaNdYDqpeiOoD3lSaZmOfbw1N8URxqB1by7cPVJhGmTO38vtn-UiYL5pu3Qoj1862dq5krM2es8X7FzUdW9Jn7kxTbmYCA8vb0pX5oVHgipDD_uHTzqAOBPYw6QygU',
    ),
}));

const container = new Container();

const otScope = nock('https://api-staging.oneytrust.com');

describe('Test suite for fiscal status usecase', () => {
  let mockBusSend: jest.Mock;
  let fiscalStatusStep: FiscalStatusStep;
  let userId: string;
  let profile: Profile;

  beforeAll(async () => {
    mockBusSend = (ServiceBusClient.createFromConnectionString(null).createTopicClient(null).createSender()
      .send as unknown) as jest.Mock;
    userId = 'ow_KFDTZq';
    config.forceAzureServiceBus = true;
    await buildProfileAdapterLib(container, config, identityConfig);
    fiscalStatusStep = container.get(FiscalStatusStep);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    const tipsDb = container.get(ProfileGenerator);
    profile = await tipsDb.beforeAddressStepSnapshot(userId);
  });

  beforeEach(() => {
    MockDate.set(new Date('2021-02-18T00:00:00.000Z'));
    mockBusSend.mockClear();
    nock.cleanAll();
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('Should complete fiscal status step', async () => {
    /* ToDo: replace by nockBack */
    const scope = nock('http://localhost:3022').patch(`/payment/user/${userId}`).reply(200);
    otScope
      .patch(
        `/tulipe/v2/${config.providersConfig.oneytrustConfig.entityReference}/cases/${profile.props.kyc.caseReference}/form-data`,
      )
      .reply(202);
    otScope
      .post(
        `/tulipe/v2/${config.providersConfig.oneytrustConfig.entityReference}/cases/${profile.props.kyc.caseReference}/analysis`,
      )
      .reply(202);
    const result = await fiscalStatusStep.execute({
      uid: userId,
      fiscalReference: {
        country: 'FR',
        fiscalNumber: '123456',
      },
      declarativeFiscalSituation: {
        income: EarningsThreshold.THRESHOLD1,
        economicActivity: '11',
      },
    });
    expect(result.props.kyc.steps.includes(Steps.FISCAL_STATUS_STEP)).toBeFalsy();
    expect(result.props.kyc.steps.includes(Steps.FACEMATCH_STEP)).toBeTruthy();
    expect(mockBusSend).toHaveBeenCalledWith(domainEvent);
    expect(mockBusSend).toHaveBeenLastCalledWith(legacyEvent);
    otScope.done();
    scope.done();
  });
});
