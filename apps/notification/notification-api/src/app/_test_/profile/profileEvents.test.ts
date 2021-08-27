import 'reflect-metadata';
import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import { ConfigService } from '@oney/env';
import {
  ConsentUpdated,
  IdentityDocumentValidated,
  ProfileActivated,
  ProfileActivationType,
  ProfileStatus,
  ProfileStatusChanged,
} from '@oney/profile-messages';
import * as path from 'path';
import { Configuration } from '../../config/config.env';
import { Kernel } from '../../di';
import { Identifiers } from '../../di/Identifiers';
import { ProfileActivatedHandler } from '../../domain/profile/ProfileActivatedHandler';
import { configureEventDispatcher } from '../../services/server';
import { RefreshClient } from '../../usecase/RefreshClient';
import { IdentityDocumentValidatedHandler } from '../../domain/profile/IdentityDocumentValidatedHandler';
import { ConsentUpdatedHandler } from '../../domain/payment/handlers/ConsentUpdatedHandler';
import { ProfileStatusChangedHandler } from '../../domain/profile/ProfileStatusChangedHandler';

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

describe('Refresh client on profile events', () => {
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

  it('should dispatch silent notification when PROFILE_ACTIVATED', async () => {
    const domainEvent: ProfileActivated = {
      id: 'aozekoazek',
      props: {
        profileStatus: ProfileStatus.ACTIVE,
        activationType: ProfileActivationType.AGGREGATION,
      },
      metadata: {
        aggregate: ProfileActivated.name,
        aggregateId: 'testUid',
      },
    };

    const handler = new ProfileActivatedHandler(kernel.get(Identifiers.RefreshClient));

    await handler.handle(domainEvent);

    expect(refreshClientSpy).toHaveBeenCalledTimes(1);
  });

  it('should dispatch silent notification when IDENTITY_DOCUMENT_VALIDATED', async () => {
    const domainEvent: IdentityDocumentValidated = {
      id: 'event-uuid',
      props: undefined,
      metadata: {
        aggregate: IdentityDocumentValidated.name,
        aggregateId: 'aggregate-uuid',
      },
    };

    const handler = new IdentityDocumentValidatedHandler(kernel.get(Identifiers.RefreshClient));

    await handler.handle(domainEvent);

    expect(refreshClientSpy).toHaveBeenCalledTimes(1);
  });

  it('should dispatch silent notification when CONSENT_UPDATED', async () => {
    const domainEvent: ConsentUpdated = {
      id: 'event-uuid',
      props: undefined,
      metadata: {
        aggregate: ConsentUpdated.name,
        aggregateId: 'aggregate-uuid',
      },
    };

    const handler = new ConsentUpdatedHandler(kernel.get(Identifiers.RefreshClient));

    await handler.handle(domainEvent);

    expect(refreshClientSpy).toHaveBeenCalledTimes(1);
  });

  it('should dispatch silent notification when PROFILE_STATUS_CHANGED', async () => {
    const domainEvent: ProfileStatusChanged = {
      id: 'event-uuid',
      props: {
        status: ProfileStatus.BLOCKED_ALREADY_EXISTS,
      },
      metadata: {
        aggregate: ProfileStatusChanged.name,
        aggregateId: 'aggregate-uuid',
        eventName: 'PROFILE_STATUS_CHANGED',
      },
    };
    const handler = new ProfileStatusChangedHandler(kernel.get(Identifiers.RefreshClient));

    await handler.handle(domainEvent);

    expect(refreshClientSpy).toHaveBeenCalledTimes(1);
  });
});
