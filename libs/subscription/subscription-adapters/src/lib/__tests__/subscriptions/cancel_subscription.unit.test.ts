/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { beforeAll, describe } from '@jest/globals';
import { Container } from 'inversify';
import {
  EnrollSubscriber,
  CancelSubscriptionByOfferId,
  SubscribeToOffer,
  SubscriptionErrors,
  ActivateSubscription,
} from '@oney/subscription-core';
import { SubscriptionStatus } from '@oney/subscription-messages';
import * as dateMock from 'jest-date-mock';
import * as moment from 'moment';
import {
  inMemoryBusModule,
  inMemorySubscriptionImplems,
  subscriptionModule,
} from '../../adapters/SubscriptionModule';

const container = new Container();
const subscriberStore = new Map();
const subscriptionStore = new Map();
describe('Unit - CancelSubscription', () => {
  const offerId = '0d84b88b-e93a-4de7-b52e-44eacd9e7b18';
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
    dateMock.clear();
  });

  beforeEach(async () => {
    await container.get(EnrollSubscriber).execute({
      uid: 'zzz',
    });
    const result = await container.get(SubscribeToOffer).execute({
      offerId,
      subscriberId: 'zzz',
    });
    subscriptionId = result.id;
  });

  it('Should cancel a subscription', async () => {
    const result = await container.get(CancelSubscriptionByOfferId).execute({
      subscriberId: 'zzz',
      offerId,
    });
    expect(result.props.endDate).toBeTruthy();
    expect(result.props.status).toEqual(SubscriptionStatus.CANCELLED);
  });

  it('Should cancel an active subscription before legal retraction days', async () => {
    await container.get(ActivateSubscription).execute({
      subscriptionId,
    });
    const result = await container.get(CancelSubscriptionByOfferId).execute({
      subscriberId: 'zzz',
      offerId,
    });
    expect(result.props.endDate).toBeTruthy();
    expect(result.props.status).toEqual(SubscriptionStatus.CANCELLED);
  });

  it('Should cancel an active subscription after legal retraction days', async () => {
    // GIVEN
    await container.get(ActivateSubscription).execute({
      subscriptionId,
    });
    // WHEN
    dateMock.advanceTo(moment().add(1, 'month').toDate());

    // THEN
    const result = await container.get(CancelSubscriptionByOfferId).execute({
      subscriberId: 'zzz',
      offerId,
    });

    expect(result.props.endDate).toBeTruthy();
    expect(result.props.status).toEqual(SubscriptionStatus.PENDING_CANCELLATION);
  });

  it('Should throw cause subscription already cancelled', async () => {
    await container.get(CancelSubscriptionByOfferId).execute({
      subscriberId: 'zzz',
      offerId,
    });
    const result = container.get(CancelSubscriptionByOfferId).execute({
      subscriberId: 'zzz',
      offerId,
    });
    await expect(result).rejects.toThrow(SubscriptionErrors.SubscriptionAlreadyCancelled);
  });

  it('Should do nothing cause subscription does not exist', async () => {
    const result = container.get(CancelSubscriptionByOfferId).execute({
      subscriberId: 'aaa',
      offerId: 'aaaz',
    });
    await expect(result).rejects.toThrow(SubscriptionErrors.SubscriptionNotFound);
  });
});
