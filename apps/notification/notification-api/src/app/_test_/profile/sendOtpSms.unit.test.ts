import 'reflect-metadata';
import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import { ConfigService } from '@oney/env';
import { PhoneOtpCreated, PhoneOtpUpdated } from '@oney/profile-messages';
import * as path from 'path';
import { Configuration } from '../../config/config.env';
import { Kernel } from '../../di';
import { Identifiers } from '../../di/Identifiers';
import { configureEventDispatcher } from '../../services/server';
import { SendOtpSms } from '../../usecase/profile/SendOtpSms';
import { PhoneOtpCreatedHandler } from '../../domain/profile/PhoneOtpCreatedHandler';
import { PhoneOtpUpdatedHandler } from '../../domain/profile/PhoneOtpUpdatedHandler';

jest.setTimeout(30000);
jest.mock('@azure/service-bus', () => {
  return {
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
          close: jest.fn().mockReturnThis(),
        }),
        createSubscriptionClient: jest.fn().mockReturnValue({
          createReceiver: jest.fn().mockReturnValue({
            registerMessageHandler: jest.fn(),
          }),
        }),
      }),
    },
  };
});

describe('Send Otp sms unit testing', () => {
  let kernel: Kernel;
  const sendOtpSmsSpy = jest.spyOn(SendOtpSms.prototype, 'execute');

  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/../env/test.env');
    await new ConfigService({ localUri: envPath }).loadEnv();
    const config = new Configuration();
    // Logger.setup(config.loggerLevel, config.appInfo);
    kernel = await configureEventDispatcher(config.serviceBusConfiguration, true);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should trigger sendOtmSms usecase when PHONE_OTP_CREATED', async () => {
    const domainEvent: PhoneOtpCreated = {
      id: 'aozekoazek',
      props: {
        uid: 'AWzclPFyN',
        code: '580461',
        phone: '+33660708090',
      },
      metadata: {
        aggregate: PhoneOtpCreated.name,
        aggregateId: 'AWzclPFyN',
      },
    };
    const handler = new PhoneOtpCreatedHandler(kernel.get(Identifiers.SendOtpSms));

    await handler.handle(domainEvent);

    expect(sendOtpSmsSpy).toHaveBeenCalledTimes(1);
  });

  it('should trigger sendOtmSms usecase when PHONE_OTP_CREATED', async () => {
    const domainEvent: PhoneOtpUpdated = {
      id: 'aozekoazek',
      props: {
        uid: 'AWzclPFyN',
        code: '580461',
        phone: '+33660708090',
      },
      metadata: {
        aggregate: PhoneOtpUpdated.name,
        aggregateId: 'AWzclPFyN',
      },
    };
    const handler = new PhoneOtpUpdatedHandler(kernel.get(Identifiers.SendOtpSms));

    await handler.handle(domainEvent);

    expect(sendOtpSmsSpy).toHaveBeenCalledTimes(1);
  });
});
