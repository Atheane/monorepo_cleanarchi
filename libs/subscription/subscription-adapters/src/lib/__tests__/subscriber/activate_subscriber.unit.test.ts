/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { beforeAll, describe } from '@jest/globals';
import { Container } from 'inversify';
import { ActivateSubscriber, EnrollSubscriber, SubscriberErrors } from '@oney/subscription-core';
import { invalidOffers } from '../fixtures/invalidOffers';
import {
  inMemoryBusModule,
  inMemorySubscriptionImplems,
  subscriptionModule,
} from '../../adapters/SubscriptionModule';
import { offers } from '../../adapters/partners/odb/offers/offers';

invalidOffers.map(item => offers.push(item));

const container = new Container();
const subscriberStore = new Map();
const subscriptionStore = new Map();
describe('Unit - ActivateSubscriber', () => {
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
      uid: 'hello',
    });
  });

  it('Should activate a subscriber', async () => {
    const activatedSubscriber = await container.get(ActivateSubscriber).execute({
      uid: 'hello',
      isValidated: true,
    });
    expect(activatedSubscriber.props.activatedAt).toBeTruthy();
  });

  it('Should not re-activate a subscriber', async () => {
    const activatedSubscriber = await container.get(ActivateSubscriber).execute({
      uid: 'hello',
      isValidated: true,
    });
    expect(activatedSubscriber.props.activatedAt).toBeTruthy();
    const result = container.get(ActivateSubscriber).execute({
      uid: 'hello',
      isValidated: true,
    });
    await expect(result).rejects.toThrow(SubscriberErrors.SubscriberAlreadyValidated);
  });
});
