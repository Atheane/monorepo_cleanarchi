import 'reflect-metadata';
import { describe, beforeAll, it, expect, jest } from '@jest/globals';
import { ConfigService } from '@oney/env';
import { ServiceBusClient } from '@azure/service-bus';
import MockDate from 'mockdate';
import * as path from 'path';
import { customerServiceDemandSent } from './fixtures/customerServiceDemandSent.fixtures';
import { Configuration } from '../../config/config.env';
import { Kernel } from '../../di';
import { Identifiers } from '../../di/Identifiers';
import { configureEventDispatcher } from '../../services/server';
import { SendCustomerServiceNotification } from '../../usecase/profile/SendCustomerServiceNotification';
import { CustomerServiceDemandSentHandler } from '../../domain/profile/CustomerServiceDemandSentHandler';

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

describe('Send email to customer service unit test', () => {
  let kernel: Kernel;
  let mockBusSend: jest.Mock;

  beforeAll(async () => {
    mockBusSend = (ServiceBusClient.createFromConnectionString(null).createTopicClient(null).createSender()
      .send as unknown) as jest.Mock;
    const envPath = path.resolve(__dirname + '/../env/test.env');
    await new ConfigService({ localUri: envPath }).loadEnv();
    const config = new Configuration();
    // Logger.setup(config.loggerLevel, config.appInfo);
    kernel = await configureEventDispatcher(config.serviceBusConfiguration, true);
  });

  beforeEach(() => {
    MockDate.set(new Date('2021-02-18T00:00:00.000Z'));
    mockBusSend.mockClear();
    jest.clearAllMocks();
  });

  it('should sent an email to customer service on CUSTOMER_SERVICE_DEMAND_SENT event', async () => {
    const sendCustomerServiceNotificationSpy = jest.spyOn(
      SendCustomerServiceNotification.prototype,
      'execute',
    );

    const event = {
      id: 'aozekoazek',
      props: {
        firstname: 'Mando',
        lastname: 'Lorian',
        birthname: 'Din Djarin',
        email: 'mando.lorian@yopmail.com',
        phone: '0707070708',
        gender: 'M',
        userId: 'cqfd',
        topic: 'Ma carte',
        demand: "j'ai perdu ma carte",
      },
    };

    const handler = new CustomerServiceDemandSentHandler(
      kernel.get(Identifiers.SendCustomerServiceNotification),
    );

    await handler.handle(event);

    expect(sendCustomerServiceNotificationSpy).toHaveBeenCalledTimes(1);
    expect(mockBusSend).toHaveBeenCalledTimes(1);
    const functionArg = mockBusSend.mock.calls[0][0];
    expect(functionArg).toEqual({
      body: {
        ...customerServiceDemandSent.body,
        content: expect.stringContaining('<p>Thématique : Ma carte</p>'),
      },
    });
  });
});
