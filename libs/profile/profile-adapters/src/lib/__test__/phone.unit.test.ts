import 'reflect-metadata';
import {
  BirthDate,
  CreateFolderRequest,
  Identifiers,
  KYC,
  Otp,
  OtpErrors,
  OtpRepositoryWrite,
  Profile,
  ProfileErrors,
  ProfileInformations,
  ProfileRepositoryRead,
  Steps,
  ValidatePhoneStep,
} from '@oney/profile-core';
import { Container } from 'inversify';
import * as nock from 'nock';
import { GenericError } from '@oney/common-core';
import MockDate from 'mockdate';
import { ServiceBusClient } from '@azure/service-bus';
import { ProfileStatus } from '@oney/profile-messages';
import * as path from 'path';
import { otpMock } from './fixtures/phoneStep/OtpGenerator';
import { config, identityConfig } from './fixtures/config';
import { ProfileGenerator } from './fixtures/tips/ProfileGenerator';
import { domainEvent, legacyEvent } from './fixtures/phoneStep/events';
import { buildProfileAdapterLib } from '../adapters/build';
import { ShortIdGenerator } from '../adapters/gateways/ShortIdGenerator';
import { OneytrustChannel } from '../adapters/providers/oneytrust/models/acquisitionsApi/CreateOneyTrustFolderRequest';
import { OneyTrustCreateFolderMapper } from '../adapters/mappers/OneyTrustCreateFolderMapper';
import { ProfileCreatedHandler } from '../adapters/events/profile/ProfileCreatedHandler';
import ApiResponseError = GenericError.ApiResponseError;

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

jest.spyOn(ShortIdGenerator.prototype, 'generateUniqueID').mockImplementation(() => 'uniqueIdUnitTest');
jest.spyOn(Date.prototype, 'getFullYear').mockImplementation(() => 2021);
jest.spyOn(Date.prototype, 'getMonth').mockImplementation(() => 1);
jest.spyOn(Date.prototype, 'getDate').mockImplementation(() => 4);
jest.spyOn(BirthDate.prototype, 'validate').mockImplementation(() => true);

const container = new Container();

describe('Test suite for Phone step', () => {
  let validatePhoneStep: ValidatePhoneStep;
  const userId = 'unitTestPhoneStep01';
  let mockedOtp: Otp;
  let profile: Profile;

  beforeAll(async () => {
    config.forceAzureServiceBus = true;
    await buildProfileAdapterLib(container, config, identityConfig);
    validatePhoneStep = container.get(ValidatePhoneStep);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    const profileDb = container.get(ProfileGenerator);
    container.bind(ProfileCreatedHandler).to(ProfileCreatedHandler);
    profile = await profileDb.generate(userId, ProfileStatus.ON_BOARDING);
  });

  describe('Phone step error handling', () => {
    afterEach(async () => {
      await container.get<OtpRepositoryWrite>(Identifiers.otpRepositoryWrite).delete(mockedOtp);
    });

    it('Should return otp not found error', async () => {
      mockedOtp = new Otp({
        ...otpMock,
        uid: userId,
      });
      const error = new OtpErrors.OtpNotFound('No phone number to validate');
      await container.get<OtpRepositoryWrite>(Identifiers.otpRepositoryWrite).save(mockedOtp);

      const result = validatePhoneStep.execute({
        code: 'test',
        uid: 'wrongUid',
      });

      await expect(result).rejects.toThrowError(error);
    });

    it('Should return expired otp error', async () => {
      mockedOtp = new Otp({
        ...otpMock,
        createdAt: '2020-05-27 16:22:43.768Z',
        uid: userId,
      });
      const error = new OtpErrors.OtpExpired('Expired OTP Code');
      await container.get<OtpRepositoryWrite>(Identifiers.otpRepositoryWrite).save(mockedOtp);

      const result = validatePhoneStep.execute({
        code: 'test',
        uid: userId,
      });

      await expect(result).rejects.toThrowError(error);
    });

    it('Should return invalid otp error', async () => {
      mockedOtp = new Otp({
        ...otpMock,
        uid: userId,
      });
      const error = new OtpErrors.OtpInvalid('Invalid OTP Code');
      await container.get<OtpRepositoryWrite>(Identifiers.otpRepositoryWrite).save(mockedOtp);

      const result = validatePhoneStep.execute({
        code: 'wrongCode',
        uid: userId,
      });

      await expect(result).rejects.toThrowError(error);
    });

    it('Should return profile not found error', async () => {
      mockedOtp = new Otp({
        ...otpMock,
        uid: 'noProfileUid',
      });
      const error = new ProfileErrors.ProfileNotFound('PROFILE_NOT_FOUND');
      await container.get<OtpRepositoryWrite>(Identifiers.otpRepositoryWrite).save(mockedOtp);

      const result = validatePhoneStep.execute({
        code: 'test',
        uid: 'noProfileUid',
      });

      await expect(result).rejects.toThrowError(error);
    });

    it('Should return api error if Oneytrust return an error', async () => {
      mockedOtp = new Otp({
        ...otpMock,
        uid: userId,
      });
      const scope = nock('https://pad-staging.api-ot.com/api/v2').post('/acquisitions').reply(500);
      const error = new ApiResponseError('ONEYTRUST_API_ERROR');
      await container.get<OtpRepositoryWrite>(Identifiers.otpRepositoryWrite).save(mockedOtp);

      const result = validatePhoneStep.execute({
        code: 'test',
        uid: userId,
      });

      await expect(result).rejects.toThrowError(error);
      scope.done();
    });
  });

  describe('Phone step unit testing', () => {
    let saveFixture: Function;
    let mockBusSend: jest.Mock;
    beforeAll(() => {
      mockBusSend = (ServiceBusClient.createFromConnectionString(null).createTopicClient(null).createSender()
        .send as unknown) as jest.Mock;
    });
    beforeEach(async () => {
      MockDate.set(new Date('2021-02-18T00:00:00.000Z'));
      mockBusSend.mockClear();
      nock.restore();
      nock.activate();
      nock.back.fixtures = path.resolve(`${__dirname}/fixtures/phoneStep`);
      nock.back.setMode('record');
      const { nockDone } = await nock.back(test.getFixtureName());
      saveFixture = nockDone;
    });

    afterEach(async () => {
      const nockObjects = nock.recorder.play();
      if (nockObjects.length == 0) {
        nock.restore();
      } else {
        console.log('saving nock fixture for: ', test.getFixtureName());
        saveFixture();
      }
      if (mockedOtp) {
        await container.get<OtpRepositoryWrite>(Identifiers.otpRepositoryWrite).delete(mockedOtp);
      }
    });

    it('Should update profile with no phone step and add kyc url and case reference', async () => {
      mockedOtp = new Otp({
        ...otpMock,
        uid: userId,
      });

      await container.get<OtpRepositoryWrite>(Identifiers.otpRepositoryWrite).save(mockedOtp);

      const result = await validatePhoneStep.execute({
        code: 'test',
        uid: userId,
      });

      expect(result.props.kyc.caseReference).toBeDefined();
      expect(result.props.kyc.url).toBeDefined();
      expect(result.props).toEqual({
        ...profile.props,
        informations: {
          ...profile.props.informations,
          phone: otpMock.phone,
        } as ProfileInformations,
        kyc: {
          ...profile.props.kyc,
          caseReference: result.props.kyc.caseReference,
          url: result.props.kyc.url,
          steps: [
            Steps.SELECT_OFFER_STEP,
            Steps.IDENTITY_DOCUMENT_STEP,
            Steps.FACEMATCH_STEP,
            Steps.ADDRESS_STEP,
            Steps.CIVIL_STATUS_STEP,
            Steps.FISCAL_STATUS_STEP,
            Steps.CONTRACT_STEP,
          ],
        } as KYC,
      });
    });

    it('Should handle Profile Created and validate phone step', async () => {
      const handler = container.get(ProfileCreatedHandler);
      await handler.handle({
        metadata: {
          aggregateId: userId,
          aggregate: Profile.name,
        },
        props: {
          phone: '+33633335552',
          digitalIdentityId: 'azeaze',
          steps: null,
          status: ProfileStatus.ON_BOARDING,
          uid: userId,
          email: 'nacimiphone8@yopmail.com',
        },
        id: 'aze',
      });
      const updatedProfile = await container
        .get<ProfileRepositoryRead>(Identifiers.profileRepositoryRead)
        .getUserById(userId);
      expect(updatedProfile.props.kyc.steps.includes(Steps.PHONE_STEP)).toBeFalsy();
    });

    it('Should handle Profile Created with no phone provided', async () => {
      const handler = container.get(ProfileCreatedHandler);
      await handler.handle({
        metadata: {
          aggregateId: '11',
          aggregate: Profile.name,
        },
        props: {
          digitalIdentityId: 'azeaze',
          steps: null,
          status: ProfileStatus.ON_BOARDING,
          uid: '11',
          email: 'azezae',
        },
        id: 'aze',
      });
    });

    it('Should update profile with with generic OTP and send both domain and legacy events', async () => {
      jest.spyOn(Date.prototype, 'getDate').mockImplementation(() => 5);
      mockedOtp = new Otp({
        ...otpMock,
        uid: userId,
      });

      await container.get<OtpRepositoryWrite>(Identifiers.otpRepositoryWrite).save(mockedOtp);

      const result = await validatePhoneStep.execute({
        code: '123456',
        uid: userId,
      });

      expect(result.props.kyc.caseReference).toBeDefined();
      expect(result.props.kyc.url).toBeDefined();
      expect(mockBusSend).toHaveBeenCalledWith(domainEvent);
      expect(mockBusSend).toHaveBeenLastCalledWith(legacyEvent);
    });
  });

  describe('Phone step OT feature flag unit testing', () => {
    const request: CreateFolderRequest = {
      caseReference: 'testCaseReference',
      masterReference: 'testMasterReference',
      email: 'email@email.fr',
      phone: 'phone',
    };

    const expectedPayload = {
      masterReference: request.masterReference,
      caseReference: request.caseReference,
      entityReference: config.providersConfig.oneytrustConfig.entityReference,
      caseType: config.providersConfig.oneytrustConfig.entityReference,
      language: config.providersConfig.oneytrustConfig.language,
      channel: OneytrustChannel.APP,
      formData: {
        email: request.email,
        phone: request.phone,
      },
    };

    it('Should return payload with a callback url', () => {
      const payload = new OneyTrustCreateFolderMapper(
        config.providersConfig.oneytrustConfig.entityReference,
        config.providersConfig.oneytrustConfig.entityReference,
        config.providersConfig.oneytrustConfig.language,
        true,
        config.providersConfig.oneytrustConfig.callbackDecisionUrl,
      ).fromDomain(request);

      expect(payload).toEqual({
        ...expectedPayload,
        callbackUrl: config.providersConfig.oneytrustConfig.callbackDecisionUrl,
      });
    });

    it('Should return payload with no callback url', () => {
      const request: CreateFolderRequest = {
        masterReference: 'testMasterReference',
        caseReference: 'testCaseReference',
        email: 'email@email.fr',
        phone: 'phone',
      };
      const payload = new OneyTrustCreateFolderMapper(
        config.providersConfig.oneytrustConfig.entityReference,
        config.providersConfig.oneytrustConfig.entityReference,
        config.providersConfig.oneytrustConfig.language,
        false,
        config.providersConfig.oneytrustConfig.callbackDecisionUrl,
      ).fromDomain(request);

      expect(payload).toEqual(expectedPayload);
    });
  });
});
