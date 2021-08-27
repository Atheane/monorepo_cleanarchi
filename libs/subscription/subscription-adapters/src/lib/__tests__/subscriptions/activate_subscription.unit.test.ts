/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { beforeAll, describe } from '@jest/globals';
import { Container } from 'inversify';
import {
  ActivateSubscription,
  EnrollSubscriber,
  GetInactiveSubscription,
  GetSubscriptionsBySubscriberId,
  SubscribeToOffer,
  SubscriptionErrors,
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
describe('Unit - ActivateSubscription', () => {
  let subscriptionId: string;
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
    subscriptionId = result.id;
  });

  it('Should activate a subscription', async () => {
    //GIVEN
    const beforeActivation = await container.get(GetInactiveSubscription).execute({
      subscriberId: 'zzz',
    });
    expect(beforeActivation.length).toEqual(1);
    expect(beforeActivation[0].props.status).toEqual(SubscriptionStatus.PENDING_ACTIVATION);
    // WHEN
    await container.get(ActivateSubscription).execute({
      subscriptionId: subscriptionId,
    });

    // THEN
    const subscriptions = await container.get(GetSubscriptionsBySubscriberId).execute({
      subscriberId: 'zzz',
    });
    expect(subscriptions[0].props.activationDate).toBeTruthy();
    expect(subscriptions[0].props.status).toEqual(SubscriptionStatus.ACTIVE);
    const afterActivation = await container.get(GetInactiveSubscription).execute({
      subscriberId: 'zzz',
    });
    expect(afterActivation.length).toEqual(0);
  });

  it('Should throw cause subscription already active', async () => {
    await container.get(ActivateSubscription).execute({
      subscriptionId: subscriptionId,
    });
    const result = container.get(ActivateSubscription).execute({
      subscriptionId: subscriptionId,
    });
    await expect(result).rejects.toThrow(SubscriptionErrors.SubscriptionAlreadyValidated);
  });
});
