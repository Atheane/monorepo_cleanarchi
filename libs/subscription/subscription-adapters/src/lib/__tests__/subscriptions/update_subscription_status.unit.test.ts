/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { beforeAll, describe } from '@jest/globals';
import { Container } from 'inversify';
import {
  ActivateSubscription,
  EnrollSubscriber,
  GetSubscriptionsBySubscriberId,
  SubscribeToOffer,
  UpdateSubscriptionStatus,
} from '@oney/subscription-core';
import { SubscriptionStatus } from '@oney/subscription-messages';
import {
  inMemoryBusModule,
  inMemorySubscriptionImplems,
  subscriptionModule,
} from '../../adapters/SubscriptionModule';

const container = new Container();
const subscriberStore = new Map();
const subscriptionStore = new Map();
describe('Unit - UpdateSubscriptionStatus', () => {
  beforeAll(async () => {
    container.load(
      subscriptionModule,
      inMemorySubscriptionImplems({
        subscriberDb: subscriberStore,
        billDb: new Map(),
        subscriptionDb: subscriptionStore,
      }),
      inMemoryBusModule(container),
    );
  });

  afterEach(() => {
    subscriberStore.clear();
    subscriptionStore.clear();
  });

  beforeEach(async () => {
    await container.get(EnrollSubscriber).execute({
      uid: 'zzz',
    });
    const result = await container.get(SubscribeToOffer).execute({
      offerId: '0d84b88b-e93a-4de7-b52e-44eacd9e7b18',
      subscriberId: 'zzz',
    });
    await container.get(ActivateSubscription).execute({
      subscriptionId: result.id,
    });
  });

  it('Should update subscription status', async () => {
    await container.get(UpdateSubscriptionStatus).execute({
      offerId: '0d84b88b-e93a-4de7-b52e-44eacd9e7b18',
      status: SubscriptionStatus.PENDING_ACTIVATION,
      subscriberId: 'zzz',
    });
    const result = await container.get(GetSubscriptionsBySubscriberId).execute({
      subscriberId: 'zzz',
    });
    expect(result[0].props.status).toEqual(SubscriptionStatus.PENDING_ACTIVATION);
  });
});
