import 'reflect-metadata';
import {
  GenerateOtpStep,
  Identifiers,
  OtpErrors,
  OtpRepositoryRead,
  OtpRepositoryWrite,
  ProfileErrors,
} from '@oney/profile-core';
import { Container } from 'inversify';
import { ServiceBusClient } from '@azure/service-bus';
import MockDate from 'mockdate';
import { config, identityConfig } from './fixtures/config';
import { ProfileGenerator } from './fixtures/tips/ProfileGenerator';
import { otpMock, phoneOtpCreatedMock, phoneOtpUpdatedMock } from './fixtures/otp/generateOtpMock';
import { buildProfileAdapterLib } from '../adapters/build';
import { OdbOtpGateway } from '../adapters/gateways/OdbOtpGateway';

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

const container = new Container();

describe('Test suite for Generate OTP Step', () => {
  let mockBusSend: jest.Mock;

  let generateOtpStep: GenerateOtpStep;
  const uid = 'AWzclPFyN';
  const code = '580461';
  const codeHash = '8352d520f473c770bcf3719e6c01979f416720cd';
  const phone = '+33660708090';
  let profileGenerator: ProfileGenerator;
  let otpRepositoryRead: OtpRepositoryRead;
  let otpRepositoryWrite: OtpRepositoryWrite;

  beforeAll(async () => {
    jest.spyOn(OdbOtpGateway.prototype, 'generateCode').mockImplementation(() => code);

    jest.spyOn(OdbOtpGateway.prototype, 'generateCodeHash').mockImplementation(() => codeHash);

    MockDate.set(new Date('2020-12-10T00:00:00.000Z'));

    config.forceAzureServiceBus = true;
    mockBusSend = (ServiceBusClient.createFromConnectionString(null).createTopicClient(null).createSender()
      .send as unknown) as jest.Mock;

    await buildProfileAdapterLib(container, config, identityConfig);

    otpRepositoryRead = container.get(Identifiers.otpRepositoryRead);
    otpRepositoryWrite = container.get(Identifiers.otpRepositoryWrite);
    generateOtpStep = container.get(GenerateOtpStep);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    profileGenerator = container.get(ProfileGenerator);
  });

  it('Should dispatch PhoneOtpCreated event', async () => {
    await profileGenerator.beforePhoneStep(uid);

    await generateOtpStep.execute({ uid, phone });

    expect(mockBusSend).toHaveBeenCalledWith(phoneOtpCreatedMock);
  });

  it('Should dispatch PhoneOtpUpdated event', async () => {
    await profileGenerator.beforePhoneStep(uid);

    await otpRepositoryWrite.save(otpMock);

    await generateOtpStep.execute({ uid, phone });

    expect(mockBusSend).toHaveBeenCalledWith(phoneOtpUpdatedMock);
  });

  it('Should throw PHONE_NUMBER_ALREADY_USED error', async () => {
    await profileGenerator.withPhoneNumber(uid, phone);

    const profileNotFoundError = new ProfileErrors.ProfileNotFound('PHONE_NUMBER_ALREADY_USED');

    const result = generateOtpStep.execute({ uid, phone });

    await expect(result).rejects.toThrowError(profileNotFoundError);
  });

  it('Should throw PHONE_NUMBER_ALREADY_VALIDATED error', async () => {
    await profileGenerator.afterPhoneStep(uid, phone);

    const phoneNumberAlreadyValidatedError = new OtpErrors.PhoneNumberAlreadyValidated(
      'PHONE_NUMBER_ALREADY_VALIDATED',
    );

    const result = generateOtpStep.execute({ uid, phone });

    await expect(result).rejects.toThrowError(phoneNumberAlreadyValidatedError);
  });

  it('Should increment creationAttempts', async () => {
    await profileGenerator.beforePhoneStep(uid);

    await otpRepositoryWrite.save(otpMock);

    await generateOtpStep.execute({ uid, phone });

    const otp = await otpRepositoryRead.getOtpByUid(uid);

    expect(otp.props.creationAttempts).toEqual(++otpMock.props.creationAttempts);
  });

  it('Should throw OTP_MAX_ATTEMPTS_EXCEEDED when creationAttempts equals OTP_MAX_ATTEMPTS', async () => {
    jest.spyOn(OdbOtpGateway.prototype, 'isLockDurationElapsed').mockImplementation(() => false);

    jest.spyOn(OdbOtpGateway.prototype, 'isMaxAttemptsExceeded').mockImplementation(() => true);

    const maxAttemptsExceededError = new OtpErrors.MaxAttemptsExceeded('OTP_MAX_ATTEMPTS_EXCEEDED');

    await otpRepositoryWrite.save(otpMock);

    await profileGenerator.beforePhoneStep(uid);

    const result = generateOtpStep.execute({ uid, phone });

    await expect(result).rejects.toThrowError(maxAttemptsExceededError);
  });

  it('Should reset creationAttempts to 1 when the lock duration has elapsed', async () => {
    jest.spyOn(OdbOtpGateway.prototype, 'isLockDurationElapsed').mockImplementation(() => true);

    otpMock.props.creationAttempts = config.otpMaxAttempts;

    await otpRepositoryWrite.save(otpMock);

    await profileGenerator.beforePhoneStep(uid);

    await generateOtpStep.execute({ uid, phone });

    const otp = await otpRepositoryRead.getOtpByUid(uid);

    expect(otp.props.creationAttempts).toEqual(1);
  });
});
