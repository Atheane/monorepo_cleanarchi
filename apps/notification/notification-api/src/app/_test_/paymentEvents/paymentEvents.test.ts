import 'reflect-metadata';
import { describe, beforeAll, it, expect, jest } from '@jest/globals';
import { ConfigService } from '@oney/env';
import {
  BankAccountMonthlyAllowanceUpdated,
  BankAccountUncappedFromAggregation,
  UncappingEventReason,
  UncappingEventState,
  UncappingStateChanged,
} from '@oney/payment-messages';
import * as path from 'path';
import { Configuration } from '../../config/config.env';
import { Kernel } from '../../di';
import { Identifiers } from '../../di/Identifiers';
import { BankAccountMonthlyAllowanceUpdatedHandler } from '../../domain/payment/handlers/BankAccountMonthlyAllowanceUpdatedHandler';
import { configureEventDispatcher } from '../../services/server';
import { RefreshClient } from '../../usecase/RefreshClient';
import { BankAccountUncappedFromAggregationHandler } from '../../domain/payment/handlers/BankAccountUncappedFromAggregationHandler';
import { UncappingStateChangedHandler } from '../../domain/payment/handlers/UncappingStateChangedHandler';

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

describe('Refresh client on payment events', () => {
  let kernel: Kernel;
  const refreshClientSpy = jest.spyOn(RefreshClient.prototype, 'execute');

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

  it('should dispatch silent notification when monthly update received', async () => {
    const domainEvent = {
      id: 'aozekoazek',
      props: {
        monthlyAllowance: {
          remainingFundToSpend: 12,
          authorizedAllowance: 125,
        },
      },
      metadata: {
        aggregate: BankAccountMonthlyAllowanceUpdated.name,
        aggregateId: 'testUid',
      },
    };

    const handler = new BankAccountMonthlyAllowanceUpdatedHandler(kernel.get(Identifiers.RefreshClient));

    await handler.handle(domainEvent);

    expect(refreshClientSpy).toHaveBeenCalledTimes(1);
  });

  it('should dispatch silent notification when bank account uncapped from aggregation received', async () => {
    const domainEvent = {
      id: 'aozekoazek',
      props: {
        globalOut: {
          annualAllowance: 12000,
          monthlyAllowance: 1000,
          weeklyAllowance: 1000,
        },
        balanceLimit: 1000,
        uncappingState: UncappingEventState.UNCAPPING,
      },
      metadata: {
        aggregate: BankAccountUncappedFromAggregation.name,
        eventName: 'BANK_ACCOUNT_UNCAPPED_FROM_AGGREGATION',
        aggregateId: 'testUid',
      },
    };

    const handler = new BankAccountUncappedFromAggregationHandler(kernel.get(Identifiers.RefreshClient));

    await handler.handle(domainEvent);

    expect(refreshClientSpy).toHaveBeenCalledTimes(1);
  });

  it('should dispatch silent notification when gets uncapping', async () => {
    const domainEvent = {
      id: 'aozekoazek',
      props: {
        uncappingState: UncappingEventState.UNCAPPING,
        reason: UncappingEventReason.TAX_STATEMENT,
      },
      metadata: {
        aggregate: UncappingStateChanged.name,
        eventName: 'UNCAPPING_STATE_CHANGED',
        aggregateId: 'testUid',
      },
    };

    const handler = new UncappingStateChangedHandler(kernel.get(Identifiers.RefreshClient));

    await handler.handle(domainEvent);

    expect(refreshClientSpy).toHaveBeenCalledTimes(1);
  });
});
