/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { beforeAll, describe } from '@jest/globals';
import { Container } from 'inversify';
import {
  EnrollSubscriber,
  GetSubscriptionByCardId,
  ProcessSubscription,
  SubscribeToOffer,
  SubscriptionErrors,
} from '@oney/subscription-core';
import {
  inMemoryBusModule,
  inMemorySubscriptionImplems,
  subscriptionModule,
} from '../../adapters/SubscriptionModule';

const container = new Container();
const subscriberStore = new Map();
const subscriptionStore = new Map();
describe('Unit - ProcessSubscription', () => {
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

  it('Should attach card to subscription', async () => {
    // GIVEN
    const nonExistingSubscription = container.get(GetSubscriptionByCardId).execute({
      cardId: 'visa-classic',
    });
    await expect(nonExistingSubscription).rejects.toThrow(SubscriptionErrors.SubscriptionNotFound);
    // WHEN
    await container.get(ProcessSubscription).execute({
      subscriptionId,
      cardId: 'visa-classic',
    });

    // THEN
    const subscription = await container.get(GetSubscriptionByCardId).execute({
      cardId: 'visa-classic',
    });
    expect(subscription.props.cardId).toEqual('visa-classic');
  });
});
