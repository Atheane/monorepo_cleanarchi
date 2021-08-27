import 'reflect-metadata';
import { Identifiers, Otp } from '@oney/profile-core';
import { Container } from 'inversify';
import MockDate from 'mockdate';
import { config, identityConfig } from './fixtures/config';
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

describe('Test suite for OTP Gateway', () => {
  let odbOtpGateway: OdbOtpGateway;
  const code = '580461';
  const codeHash = '8352d520f473c770bcf3719e6c01979f416720cd';
  const otpMock = new Otp({
    uid: 'AWzclPFyN',
    phone: '+33660708090',
    codeHash: '8352d520f473c770bcf3719e6c01979f416720cd',
    creationAttempts: 4,
    createdAt: '2020-12-10T00:00:00.000Z',
    updatedAt: '2020-12-10T00:00:00.000Z',
  });

  beforeAll(async () => {
    await buildProfileAdapterLib(container, config, identityConfig);
    odbOtpGateway = container.get<OdbOtpGateway>(Identifiers.otpGateway);
  });

  it('Should generate a new code', async () => {
    const code = await odbOtpGateway.generateCode();

    expect(typeof code).toBe('string');
    expect(code.length).toBe(6);
  });

  it('Should generate code hash', async () => {
    const result = await odbOtpGateway.generateCodeHash(code);

    expect(result).toEqual(codeHash);
  });

  it('Should return true when otp.creationAttempts is greater then OTP_MAX_ATTEMPTS', async () => {
    otpMock.props.creationAttempts = config.otpMaxAttempts + 1;

    const result = await odbOtpGateway.isMaxAttemptsExceeded(otpMock);
    expect(result).toBeTruthy();
  });

  it('Should return true when otp.creationAttempts is less then OTP_MAX_ATTEMPTS', async () => {
    otpMock.props.creationAttempts = config.otpMaxAttempts - 1;

    const result = await odbOtpGateway.isMaxAttemptsExceeded(otpMock);
    expect(result).toBeFalsy();
  });

  it('Should return true when otp.creationAttempts is equals then OTP_MAX_ATTEMPTS', async () => {
    otpMock.props.creationAttempts = config.otpMaxAttempts;

    const result = await odbOtpGateway.isMaxAttemptsExceeded(otpMock);
    expect(result).toBeTruthy();
  });

  it('Should return true when OTP_LOCK_DURATION_HOURS has elapsed', async () => {
    otpMock.props.updatedAt = new Date('2020-12-10T00:00:00.000Z').toISOString();

    const result = await odbOtpGateway.isLockDurationElapsed(otpMock);
    expect(result).toBeTruthy();
  });

  it('Should return false when OTP_LOCK_DURATION_HOURS has not elapsed', async () => {
    MockDate.set(new Date('2020-12-10T04:00:00.000Z'));

    otpMock.props.updatedAt = new Date('2021-04-17T00:00:00.000Z').toISOString();

    const result = await odbOtpGateway.isLockDurationElapsed(otpMock);
    expect(result).toBeFalsy();

    MockDate.reset;
  });
});
