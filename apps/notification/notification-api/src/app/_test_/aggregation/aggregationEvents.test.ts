import 'reflect-metadata';
import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import { ConnectionStateEnum } from '@oney/aggregation-core';
import { BankConnectionDeleted, ThirdPartyAuthFinished } from '@oney/aggregation-messages';
import { ConfigService } from '@oney/env';
import * as path from 'path';
import { Configuration } from '../../config/config.env';
import { Kernel } from '../../di';
import { Identifiers } from '../../di/Identifiers';
import { AccountSynchronizedHandler } from '../../domain/aggregation/handlers/AccountSynchronizedHandler';
import { AggregationThirdPartyAuthFinishedHandler } from '../../domain/aggregation/handlers/AggregationThirdPartyAuthFinishedHandler';
import { BankConnectionDeletedHandler } from '../../domain/aggregation/handlers/BankConnectionDeletedHandler';
import { configureEventDispatcher } from '../../services/server';
import { RefreshClient } from '../../usecase/RefreshClient';

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

  it('should dispatch silent notification when BANK_CONNECTION_DELETED', async () => {
    const domainEvent: BankConnectionDeleted = {
      id: 'aozekoazek',
      props: {
        userId: 'azieh',
        deletedAccountIds: ['1', '2'],
        refId: '123',
      },
      metadata: {
        aggregate: BankConnectionDeleted.name,
        aggregateId: 'testUid',
      },
    };

    const handler = new BankConnectionDeletedHandler(kernel.get(Identifiers.RefreshClient));

    await handler.handle(domainEvent);

    expect(refreshClientSpy).toHaveBeenCalledTimes(1);
  });

  it('should dispatch silent notification when THIRD_PARTY_AUTH_FINISHED', async () => {
    const domainEvent = {
      id: 'aozekoazek',
      props: {
        userId: 'azieh',
        state: ConnectionStateEnum.VALID,
      },
      metadata: {
        aggregate: ThirdPartyAuthFinished.name,
        aggregateId: 'testUid',
      },
    };

    const handler = new AggregationThirdPartyAuthFinishedHandler(kernel.get(Identifiers.RefreshClient));

    await handler.handle(domainEvent);
    expect(refreshClientSpy).toHaveBeenCalledTimes(1);
  });

  it('should dispatch silent notification when ACCOUNT_SYNCHRONIZED', async () => {
    const domainEvent = {
      id: 'aozekoazek',
      props: {
        userId: 'azieh',
      },
    };

    const handler = new AccountSynchronizedHandler(kernel.get(Identifiers.RefreshClient));

    await handler.handle(domainEvent);

    expect(refreshClientSpy).toHaveBeenCalledTimes(1);
  });
});
