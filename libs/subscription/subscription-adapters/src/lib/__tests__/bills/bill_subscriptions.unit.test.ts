import 'reflect-metadata';
import { beforeAll, describe } from '@jest/globals';
import { Container } from 'inversify';
import {
  ActivateSubscriber,
  BillSubscriptions,
  CancelSubscriptionByOfferId,
  EnrollSubscriber,
  GetBillBySubscriptionId,
  SubscribeToOffer,
  UpdateCustomerType,
} from '@oney/subscription-core';
import * as dateMock from 'jest-date-mock';
import * as moment from 'moment';
import { CustomerType } from '@oney/subscription-messages';
import {
  inMemoryBusModule,
  inMemorySubscriptionImplems,
  subscriptionModule,
} from '../../adapters/SubscriptionModule';

const container = new Container();
const subscriberStore = new Map();
const subscriptionStore = new Map();
const billStore = new Map();

describe('Unit - BillSubscriptions', () => {
  let subscriptionId: string;
  const subscriberId = 'zzz';
  const offerId = '0d84b88b-e93a-4de7-b52e-44eacd9e7b18';
  beforeAll(() => {
    container.load(
      subscriptionModule,
      inMemorySubscriptionImplems({
        subscriberDb: subscriberStore,
        billDb: billStore,
        subscriptionDb: subscriptionStore,
      }),
      inMemoryBusModule(container),
    );
  });

  afterEach(() => {
    subscriberStore.clear();
    subscriptionStore.clear();
    billStore.clear();
    dateMock.clear();
  });

  beforeEach(async () => {
    await container.get(EnrollSubscriber).execute({
      uid: subscriberId,
    });
    await container.get(ActivateSubscriber).execute({
      uid: subscriberId,
      isValidated: true,
    });
    const subscription = await container.get(SubscribeToOffer).execute({
      offerId,
      subscriberId,
    });
    subscriptionId = subscription.id;
  });

  it('Should schedule bills after one month', async () => {
    // GIVEN
    await container.get(BillSubscriptions).execute();
    const first_bills_scheduled = await container.get(GetBillBySubscriptionId).execute({
      subscriptionId,
    });
    expect(first_bills_scheduled.length).toEqual(0);

    // WHEN
    dateMock.advanceTo(moment().add(1, 'month').toDate());
    await container.get(BillSubscriptions).execute();

    // THEN
    const results = await container.get(GetBillBySubscriptionId).execute({
      subscriptionId,
    });
    expect(results.length).toEqual(1);
    expect(results[0].props.amount).toEqual(2.5);

    // EXTRA (In memory only for testing else case in InMemoryOdbBillingRepository).
    const billsNotFound = await container.get(GetBillBySubscriptionId).execute({
      subscriptionId: 'notfound',
    });
    expect(billsNotFound.length).toEqual(0);
  });

  it('Should not re-schedule cancelled subscription', async () => {
    // GIVEN
    dateMock.advanceTo(moment().add(1, 'month').toDate());
    await container.get(BillSubscriptions).execute();
    const results = await container.get(GetBillBySubscriptionId).execute({
      subscriptionId,
    });
    expect(results.length).toEqual(1);

    // WHEN
    await container.get(CancelSubscriptionByOfferId).execute({
      offerId,
      subscriberId,
    });

    // THEN
    await container.get(BillSubscriptions).execute();
    await container.get(GetBillBySubscriptionId).execute({
      subscriptionId,
    });
    expect(results.length).toEqual(1);
  });

  it('Should apply discount on VIP Customer', async () => {
    // GIVEN
    await container.get(UpdateCustomerType).execute({
      customerType: CustomerType.VIP,
      uid: subscriberId,
    });
    // WHEN
    dateMock.advanceTo(moment().add(1, 'month').toDate());
    await container.get(BillSubscriptions).execute();
    // THEN
    const results = await container.get(GetBillBySubscriptionId).execute({
      subscriptionId,
    });
    expect(results.length).toEqual(1);
    expect(results[0].props.amount).toEqual(0);
  });
});
