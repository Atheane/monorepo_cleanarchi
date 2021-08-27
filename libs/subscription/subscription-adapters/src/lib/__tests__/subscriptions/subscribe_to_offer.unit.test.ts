/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { beforeAll, describe } from '@jest/globals';
import { Container } from 'inversify';
import {
  CancelSubscriptionByOfferId,
  EnrollSubscriber,
  SubscribeToOffer,
  SubscriptionErrors,
} from '@oney/subscription-core';
import { SubscriptionStatus } from '@oney/subscription-messages';
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
describe('Unit - SubscribeToOffer', () => {
  const subscriberId = 'zzz';
  const oneyPremium = '0d84b88b-e93a-4de7-b52e-44eacd9e7b18';
  const classicVisa = 'c7cf068d-77ae-46b0-bf1f-afd938f4fc85';
  const accountFee = '29540f78-db46-4a2b-8ff5-49d982773d51';
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
      uid: subscriberId,
    });
  });

  it('Should subscribe to offer Oney Premium monthly', async () => {
    const result = await container.get(SubscribeToOffer).execute({
      offerId: oneyPremium,
      subscriberId: subscriberId,
    });
    expect(result.props.offerId).toEqual(oneyPremium);
    expect(result.props.subscriberId).toEqual(subscriberId);
    expect(result.props.status).toEqual(SubscriptionStatus.PENDING_ACTIVATION);
  });

  it('Should throw error cause offer not found', async () => {
    const result = container.get(SubscribeToOffer).execute({
      offerId: 'offernotfound',
      subscriberId,
    });
    await expect(result).rejects.toThrow(SubscriptionErrors.OfferNotFound);
  });

  it('Should throw cause offer period is invalid', async () => {
    const result = container.get(SubscribeToOffer).execute({
      offerId: 'periodicityInvalid',
      subscriberId,
    });
    await expect(result).rejects.toThrow(SubscriptionErrors.PeriodicityInvalid);
  });

  it('Should subscribe to annual offer', async () => {
    const result = await container.get(SubscribeToOffer).execute({
      offerId: 'annualOffer',
      subscriberId,
    });
    expect(result.props.offerId).toEqual('annualOffer');
  });

  it('Should throw cause discount type is not valid', async () => {
    const result = container.get(SubscribeToOffer).execute({
      offerId: 'invalidDiscountType',
      subscriberId,
    });
    await expect(result).rejects.toThrow(SubscriptionErrors.InvalidDiscountType);
  });

  it('Should subscribe to offer classicVisa offer', async () => {
    const result = await container.get(SubscribeToOffer).execute({
      offerId: classicVisa,
      subscriberId,
    });
    expect(result.props.offerId).toEqual(classicVisa);
  });

  it('Should subscribe to account_fee offer', async () => {
    const result = await container.get(SubscribeToOffer).execute({
      offerId: accountFee,
      subscriberId,
    });
    expect(result.props.offerId).toEqual(accountFee);
  });

  it('Should re-subscribe to previously cancelled subscription', async () => {
    await container.get(SubscribeToOffer).execute({
      offerId: classicVisa,
      subscriberId,
    });
    const cancelledSubscription = await container.get(CancelSubscriptionByOfferId).execute({
      subscriberId,
      offerId: classicVisa,
    });
    expect(cancelledSubscription.props.status).toEqual(SubscriptionStatus.CANCELLED);

    const result = await container.get(SubscribeToOffer).execute({
      offerId: classicVisa,
      subscriberId,
    });
    expect(result.props.offerId).toEqual(classicVisa);
  });
});
