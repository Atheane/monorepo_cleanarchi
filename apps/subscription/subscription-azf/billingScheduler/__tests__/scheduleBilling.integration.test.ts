import 'reflect-metadata';
import {
  ActivateSubscriber,
  ActivateSubscription,
  EnrollSubscriber,
  SubscribeToOffer,
} from '@oney/subscription-core';
import * as dateMock from 'jest-date-mock';
import * as moment from 'moment';
import { ConfigService } from '@oney/envs';
import { Context } from '@azure/functions';
import * as path from 'path';
import { SubscriptionKernel } from '../config/SubscriptionKernel';
import { keyvaultConfiguration, localConfiguration } from '../config/EnvConfiguration';
import scheduleBilling from '../index';

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
    }),
  },
}));

describe('Schedule Billing integration testing', function () {
  let container: SubscriptionKernel;
  beforeAll(async () => {
    await new ConfigService({
      localUri: path.resolve(__dirname + '/../test.env'),
      keyvaultUri: null,
    }).loadEnv();
    container = new SubscriptionKernel(localConfiguration, keyvaultConfiguration);
    await container.initDependencies();
  });

  afterEach(() => {
    dateMock.clear();
  });

  it('Should subscribe to offer Oney Premium monthly, activate and Schedule Billing', async () => {
    await container.get(EnrollSubscriber).execute({
      uid: 'zzz',
    });
    await container.get(EnrollSubscriber).execute({
      uid: 'sss',
    });
    const result = await container.get(SubscribeToOffer).execute({
      offerId: '3c268607-8e11-4781-8293-cb3191bbc90d',
      subscriberId: 'zzz',
    });
    await container.get(ActivateSubscriber).execute({
      uid: 'zzz',
      isValidated: true,
    });
    await container.get(ActivateSubscriber).execute({
      uid: 'sss',
      isValidated: true,
    });
    await container.get(ActivateSubscription).execute({
      subscriptionId: result.id,
    });

    dateMock.advanceTo(moment().add(1, 'month').toDate());
    const context = {
      res: {},
    } as Context;
    await scheduleBilling(context);

    // Should not reschedule billing cause nextBillingDate has been update.
    await scheduleBilling(context);

    // Imagine we schedule one and missed 3 payments.
    dateMock.advanceTo(moment().add(3, 'month').toDate());
    await scheduleBilling(context);
    await scheduleBilling(context);
  });
});
