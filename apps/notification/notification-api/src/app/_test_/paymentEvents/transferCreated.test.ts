import 'reflect-metadata';
import { describe, beforeAll, it, expect, jest } from '@jest/globals';
import { ConfigService } from '@oney/env';
import { TransferCreated } from '@oney/payment-messages';
import { ServiceBusClient } from '@azure/service-bus';
import * as path from 'path';
import {
  transferCreatedMessageWithoutReason,
  transferCreatedMessageWithReason,
} from './fixtures/transferCreated.fixtures';
import { Configuration } from '../../config/config.env';
import { Kernel } from '../../di';
import { Identifiers } from '../../di/Identifiers';
import { configureDatabase, configureEventDispatcher } from '../../services/server';
import { SendTransferNotification } from '../../usecase/payment/SendTransferNotification';
import { PaymentTransferCreatedHandler } from '../../domain/payment/handlers/PaymentTransferCreatedHandler';
import { RecipientModel } from '../../database/schemas/recipient';
import { recipientToSaveInDbMocked } from '../fixtures/generateBankAccountBisDocument';

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

describe('Send transfer email on transfer created event', () => {
  let kernel: Kernel;
  let mockBusSend: jest.Mock;
  const sendTransferNotificationSpy = jest.spyOn(SendTransferNotification.prototype, 'execute');

  beforeAll(async () => {
    mockBusSend = (ServiceBusClient.createFromConnectionString(null).createTopicClient(null).createSender()
      .send as unknown) as jest.Mock;
    const envPath = path.resolve(__dirname + '/../env/test.env');
    await new ConfigService({ localUri: envPath }).loadEnv();
    const config = new Configuration();
    // Logger.setup(config.loggerLevel, config.appInfo);
    kernel = await configureEventDispatcher(config.serviceBusConfiguration, true);
    await configureDatabase({ uri: process.env.MONGO_URL });
  });

  afterEach(async () => {
    jest.clearAllMocks();
    mockBusSend.mockClear();
  });

  it('should send an email notification with reason when transfer created received', async () => {
    await RecipientModel.create(recipientToSaveInDbMocked);
    const domainEvent = {
      id: 'aozekoazek',
      props: {
        id: 'aozekoazek',
        beneficiary: {
          id: '658465',
          uid: '1234',
        },
        sender: {
          id: '4321',
          uid: 'kTDhDRrHv',
        },
        amount: 1000,
        message: 'Raison valable',
        orderId: 'XXX',
        executionDate: new Date('1990-01-01T00:00:00.000Z'),
        recurrence: null,
        recipientEmail: 'receipientemail@yopmail.com',
      },
      metadata: {
        aggregate: TransferCreated.name,
        aggregateId: 'testUid',
      },
    };

    const handler = new PaymentTransferCreatedHandler(kernel.get(Identifiers.SendTransferNotification));

    await handler.handle(domainEvent);

    expect(sendTransferNotificationSpy).toHaveBeenCalledTimes(1);
    expect(mockBusSend).toHaveBeenCalledWith(transferCreatedMessageWithReason);
  });

  it('should send an email notification without reason when transfer created received', async () => {
    const domainEvent = {
      id: 'aozekoazek',
      props: {
        id: 'aozekoazek',
        beneficiary: {
          id: '65465',
          uid: '1234',
        },
        sender: {
          uid: 'kTDhDRrHv',
          id: '4321',
        },
        amount: 1000,
        message: null,
        orderId: 'XXX',
        executionDate: new Date('1990-01-01T00:00:00.000Z'),
        recurrence: null,
        recipientEmail: 'receipientemail@yopmail.com',
      },
      metadata: {
        aggregate: TransferCreated.name,
        aggregateId: 'testUid',
      },
    };

    const handler = new PaymentTransferCreatedHandler(kernel.get(Identifiers.SendTransferNotification));

    await handler.handle(domainEvent);

    expect(sendTransferNotificationSpy).toHaveBeenCalledTimes(1);
    expect(mockBusSend).toHaveBeenCalledWith(transferCreatedMessageWithoutReason);
  });
});
