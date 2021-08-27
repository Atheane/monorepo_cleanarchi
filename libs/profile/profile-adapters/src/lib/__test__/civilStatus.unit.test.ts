import 'reflect-metadata';
import { buildProfileAdapterLib, ProfileGenerator } from '@oney/profile-adapters';
import {
  CivilStatus,
  CivilStatusRequest,
  HonorificCode,
  ProfileErrorCodes,
  ProfileErrors,
  Steps,
} from '@oney/profile-core';
import { Container } from 'inversify';
import MockDate from 'mockdate';
import * as nock from 'nock';
import { ServiceBusClient } from '@azure/service-bus';
import * as queryString from 'querystring';
import * as path from 'path';
import {
  SITUATION_ATTACHED_LEAD_FALSE_LEN_OFF_CNIL_OFF,
  SITUATION_ATTACHED_LEAD_FALSE_LEN_ON_CNIL_OFF,
  SITUATION_ATTACHED_LEAD_FALSE_NO_LEN_CNIL_ON,
  SITUATION_ATTACHED_LEAD_TRUE,
} from './fixtures/civilStatus/SituationAttachedEvent';
import { config, identityConfig } from './fixtures/config';
import {
  domainEvent,
  domainEventCustomerSituation,
  domainEventError,
  legacyEvent,
} from './fixtures/civilStatus/domainEvents';
import { OneyB2CCustomerMapper } from '../adapters/mappers/OneyB2CCustomerMapper';
import { CreateCustomerRequest } from '../adapters/providers/oneyB2C/models/CreateCustomerRequest';

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/civilStatus`);
nockBack.setMode('record');

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

describe('Test suite for profile adapters', () => {
  let mockBusSend: jest.Mock;
  let civilStatus: CivilStatus;
  let userId: string;
  const USER = {
    id: 'bsXXuYexC',
    email: 'iyanda5@yopmail.com',
  };

  let profileGenerator: ProfileGenerator;

  const request: CivilStatusRequest = {
    birthDistrictCode: '01',
    birthDepartmentCode: '75',
    birthCountry: 'FR',
    birthCity: 'Paris',
    birthDate: new Date('1992-11-15'),
    birthName: 'ellezam',
    firstName: 'chalom',
    gender: HonorificCode.MALE,
    nationality: 'FR',
    legalName: 'azaeaze',
  };

  beforeAll(async () => {
    mockBusSend = (ServiceBusClient.createFromConnectionString(null).createTopicClient(null).createSender()
      .send as unknown) as jest.Mock;
    userId = 'AWzclPFyN';
    config.forceAzureServiceBus = true;
    await buildProfileAdapterLib(container, config, identityConfig);
    civilStatus = container.get(CivilStatus);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    profileGenerator = container.get(ProfileGenerator);
    await profileGenerator.beforeCivilStatusSnapshot(userId);
    await profileGenerator.beforeCivilStatusSnapshot(USER.id, USER.email);
  });

  beforeEach(() => {
    MockDate.set(new Date('2021-02-18T00:00:00.000Z'));
    mockBusSend.mockClear();
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('Should complete civilStatus step with MALE', async () => {
    MockDate.set(new Date('2020-12-10T00:00:00.000Z'));
    const { nockDone } = await nockBack('completeCivilStatusMale.json', { before });
    const result = await civilStatus.execute(request, {
      ipAddress: 'aaazzz',
      uid: userId,
    } as any);
    expect(result.props.informations.birthCountry.value).toEqual(request.birthCountry);
    expect(result.props.informations.birthDate).toEqual(request.birthDate);
    expect(result.props.kyc.steps.includes(Steps.CIVIL_STATUS_STEP)).toBeFalsy();
    expect(result.props.kyc.steps.includes(Steps.FACEMATCH_STEP)).toBeTruthy();
    expect(mockBusSend).toHaveBeenNthCalledWith(1, domainEvent);
    expect(mockBusSend).toHaveBeenNthCalledWith(2, domainEventCustomerSituation);
    expect(mockBusSend).toHaveBeenNthCalledWith(3, legacyEvent);
    nockDone();
  });

  it('Should complete civilStatus step with FEMALE', async () => {
    const { nockDone } = await nockBack('completeCivilStatusFemale.json', { before });
    const result = await civilStatus.execute(
      {
        ...request,
        gender: HonorificCode.FEMALE,
        nationality: 'FR',
        legalName: 'azaeaze',
      },
      {
        ipAddress: 'aaazzz',
        uid: userId,
      } as any,
    );
    expect(result.props.kyc.steps.includes(Steps.CIVIL_STATUS_STEP)).toBeFalsy();
    expect(result.props.kyc.steps.includes(Steps.FACEMATCH_STEP)).toBeTruthy();
    nockDone();
  });

  it('Should complete with the optional informations', async () => {
    const { nockDone } = await nockBack('completeCivilStatusMale.json', { before });
    const result = await civilStatus.execute(
      {
        ...request,
        legalName: 'ellezam',
      },
      {
        ipAddress: 'aaazzz',
        uid: userId,
      } as any,
    );
    expect(result.props.kyc.steps.includes(Steps.CIVIL_STATUS_STEP)).toBeFalsy();
    expect(result.props.kyc.steps.includes(Steps.FACEMATCH_STEP)).toBeTruthy();
    nockDone();
  });

  // ------------------------------------------------------------------------------------

  it('Should complete civilStatus step with updating a user without len flags, with cnil flags ON and send event SITUATION_ATTACHED', async () => {
    const { nockDone } = await nockBack('completeCivilStatus_updating_a_user_no_len_cnil_on.json', {
      before,
    });
    const spy = spyOn(civilStatus._customerGateway, 'update').and.callThrough();
    const result = await civilStatus.execute(
      {
        birthDistrictCode: '01',
        birthDepartmentCode: '75',
        birthCountry: 'FR',
        birthCity: 'Paris',
        birthDate: new Date('1992-11-15'),
        birthName: 'ellezam',
        firstName: 'chalom',
        gender: HonorificCode.MALE,
        nationality: 'FR',
        legalName: 'azaeaze',
      },
      {
        ipAddress: 'aaazzz',
        uid: userId,
      } as any,
    );
    expect(spy.calls.any()).toBe(true);
    expect(result.props.kyc.steps.includes(Steps.CIVIL_STATUS_STEP)).toBeFalsy();
    expect(result.props.kyc.steps.includes(Steps.FACEMATCH_STEP)).toBeTruthy();
    expect(mockBusSend).toHaveBeenNthCalledWith(2, SITUATION_ATTACHED_LEAD_FALSE_NO_LEN_CNIL_ON);
    nockDone();
  });

  it('Should complete civilStatus step with updating a user with len flags ON, with cnil flag OFF and send event SITUATION_ATTACHED', async () => {
    const { nockDone } = await nockBack('completeCivilStatus_updating_a_user_len_on_cnil_off.json', {
      before,
    });
    const spy = spyOn(civilStatus._customerGateway, 'update').and.callThrough();
    const result = await civilStatus.execute(
      {
        birthDistrictCode: '01',
        birthDepartmentCode: '75',
        birthCountry: 'FR',
        birthCity: 'Paris',
        birthDate: new Date('1992-11-15'),
        birthName: 'ellezam',
        firstName: 'chalom',
        gender: HonorificCode.MALE,
        nationality: 'FR',
        legalName: 'azaeaze',
      },
      {
        ipAddress: 'aaazzz',
        uid: userId,
      } as any,
    );
    expect(spy.calls.any()).toBe(true);
    expect(result.props.kyc.steps.includes(Steps.CIVIL_STATUS_STEP)).toBeFalsy();
    expect(result.props.kyc.steps.includes(Steps.FACEMATCH_STEP)).toBeTruthy();
    expect(mockBusSend).toHaveBeenNthCalledWith(2, SITUATION_ATTACHED_LEAD_FALSE_LEN_ON_CNIL_OFF);
    nockDone();
  });

  it('Should complete civilStatus step with updating a user with len flags OFF, with cnil flag OFF and send event SITUATION_ATTACHED', async () => {
    const { nockDone } = await nockBack('completeCivilStatus_updating_a_user_len_off_cnil_off.json', {
      before,
    });
    const spy = spyOn(civilStatus._customerGateway, 'update').and.callThrough();
    const result = await civilStatus.execute(
      {
        birthDistrictCode: '01',
        birthDepartmentCode: '75',
        birthCountry: 'FR',
        birthCity: 'Paris',
        birthDate: new Date('1992-11-15'),
        birthName: 'ellezam',
        firstName: 'chalom',
        gender: HonorificCode.MALE,
        nationality: 'FR',
        legalName: 'azaeaze',
      },
      {
        ipAddress: 'aaazzz',
        uid: userId,
      } as any,
    );
    expect(spy.calls.any()).toBe(true);
    expect(result.props.kyc.steps.includes(Steps.CIVIL_STATUS_STEP)).toBeFalsy();
    expect(result.props.kyc.steps.includes(Steps.FACEMATCH_STEP)).toBeTruthy();
    expect(mockBusSend).toHaveBeenNthCalledWith(2, SITUATION_ATTACHED_LEAD_FALSE_LEN_OFF_CNIL_OFF);
    nockDone();
  });

  // ------------------------------------------------------------------------------------

  it('Should complete civilStatus step with creating a user and send event SITUATION_ATTACHED', async () => {
    const { nockDone } = await nockBack('completeCivilStatus_creating_a_user.json', { before });
    const spy = spyOn(civilStatus._customerGateway, 'create').and.callThrough();
    const result = await civilStatus.execute(
      {
        birthDistrictCode: '01',
        birthDepartmentCode: '75',
        birthCountry: 'FR',
        birthCity: 'Paris',
        birthDate: new Date('1992-11-15'),
        birthName: 'ellezam',
        firstName: 'chalom',
        gender: HonorificCode.MALE,
        nationality: 'FR',
        legalName: 'azaeaze',
      },
      {
        ipAddress: 'aaazzz',
        uid: USER.id,
      } as any,
    );
    expect(spy.calls.any()).toBe(true);
    expect(result.props.kyc.steps.includes(Steps.CIVIL_STATUS_STEP)).toBeFalsy();
    expect(result.props.kyc.steps.includes(Steps.FACEMATCH_STEP)).toBeTruthy();
    expect(mockBusSend).toHaveBeenNthCalledWith(2, SITUATION_ATTACHED_LEAD_TRUE);
    nockDone();
  });

  it('Should return error cause birthCountry is US', async () => {
    MockDate.set(new Date('2020-12-10T00:00:00.000Z'));
    const expectedError = new ProfileErrors.UnauthorizedBirthCountry('Birth Country is not authorized');
    const result = civilStatus.execute(
      {
        ...request,
        birthCountry: 'US',
      },
      {
        ipAddress: 'aaazzz',
        uid: userId,
      } as any,
    );
    await expect(result).rejects.toThrow(expectedError);
    expect(mockBusSend).toHaveBeenCalledWith(domainEventError);
  });

  it('Should return error cause birthDate is in future', async () => {
    MockDate.set(new Date('2020-12-10T00:00:00.000Z'));
    const expectedError = new ProfileErrors.UnauthorizedAge(
      'Birth Date cannot be in the future',
      ProfileErrorCodes.BIRTHDATE_IN_FUTURE,
    );
    const result = civilStatus.execute(
      {
        ...request,
        birthDate: new Date('2135-11-15'),
      },
      {
        ipAddress: 'aaazzz',
        uid: userId,
      } as any,
    );
    await expect(result).rejects.toThrow(expectedError);
    expect(mockBusSend).toHaveBeenCalledWith({
      ...domainEventError,
      body:
        '{"name":"UnauthorizedAge","code":"E001_V023","domainEventProps":{"timestamp":1607558400000,"sentAt":"2020-12-10T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregateId":"AWzclPFyN","aggregate":"Profile","namespace":"@oney/profile","eventName":"CIVIL_STATUS_VALIDATION_FAILED","version":1}}}',
    });
  });

  it('Should return error cause age is less than 18', async () => {
    const expectedError = new ProfileErrors.UnauthorizedAge(
      'User must be more than 18',
      ProfileErrorCodes.LESS_THAN_MIN_AGE,
    );
    const result = civilStatus.execute(
      {
        ...request,
        birthDate: new Date('2021-01-01'),
      },
      {
        ipAddress: 'aaazzz',
        uid: userId,
      } as any,
    );
    await expect(result).rejects.toThrow(expectedError);
  });

  it('Should return error cause age is more than 100', async () => {
    const expectedError = new ProfileErrors.UnauthorizedAge(
      'User must be less than 100',
      ProfileErrorCodes.MORE_THAN_MAX_AGE,
    );
    const result = civilStatus.execute(
      {
        ...request,
        birthDate: new Date('1901-01-01'),
      },
      {
        ipAddress: 'aaazzz',
        uid: userId,
      } as any,
    );
    await expect(result).rejects.toThrow(expectedError);
  });

  it('Should map profile to Oney FR create customer request', async () => {
    const profile = await profileGenerator.getProfileFemale(USER.id);

    const request: CreateCustomerRequest = new OneyB2CCustomerMapper().fromDomain(profile);

    expect(request.birth_country).toBe('France');
    expect(request.birth_country_code).toBe('FR');
  });
});
