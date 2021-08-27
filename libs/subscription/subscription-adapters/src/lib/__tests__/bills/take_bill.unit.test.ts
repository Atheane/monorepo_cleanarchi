/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { beforeAll, describe } from '@jest/globals';
import { Container } from 'inversify';
import {
  ActivateSubscriber,
  BillingRepository,
  BillSubscriptions,
  EnrollSubscriber,
  GetBillBySubscriptionId,
  SubscribeToOffer,
  SubscriptionIdentifier,
  PayBills,
  UpdateCustomerType,
} from '@oney/subscription-core';
import * as dateMock from 'jest-date-mock';
import * as moment from 'moment';
import * as nock from 'nock';
import { CustomerType } from '@oney/subscription-messages';
import {
  billingModule,
  inMemoryBusModule,
  inMemorySubscriptionImplems,
  subscriptionModule,
} from '../../adapters/SubscriptionModule';

const container = new Container();
const subscriberStore = new Map();
const subscriptionStore = new Map();
const billStore = new Map();

describe('Unit - PayBill', () => {
  let subscriptionId: string;
  let scope: nock.Scope;
  const subscriberId = 'zzz';
  const offerId = '0d84b88b-e93a-4de7-b52e-44eacd9e7b18';
  beforeAll(() => {
    const baseUrl = 'http://dev.api';
    const billing = billingModule({
      authKey: 'IamTheAuthKey',
      frontDoorBaseApiUrl: baseUrl,
    });
    container.load(
      subscriptionModule,
      inMemorySubscriptionImplems({
        subscriberDb: subscriberStore,
        billDb: billStore,
        subscriptionDb: subscriptionStore,
      }),
      inMemoryBusModule(container),
      billing,
    );
    scope = nock(baseUrl);
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

  it('Should take sheduled bills', async () => {
    scope
      .filteringRequestBody(function (path) {
        const obj = JSON.parse(path);
        delete obj.orderId;
        return obj;
      })
      .post('/payment/p2p', { amount: 2.5, message: '', recurency: null, ref: 73, senderId: 'zzz' })
      .reply(200);
    // GIVEN
    dateMock.advanceTo(moment().add(1, 'month').toDate());
    await container.get(BillSubscriptions).execute();
    const scheduledBills = await container.get(GetBillBySubscriptionId).execute({
      subscriptionId,
    });
    expect(scheduledBills.length).toEqual(1);
    expect(scheduledBills[0].props.amount).toEqual(2.5);

    // WHEN
    await container.get(PayBills).execute();

    // THEN
    const takedBills = await container.get(GetBillBySubscriptionId).execute({
      subscriptionId,
    });
    expect(takedBills.length).toEqual(1);
    expect(takedBills[0].props.amount).toEqual(2.5);
    expect(takedBills[0].props.payedAt).toBeTruthy();
  });

  it('Should take bill which is equal to 0', async () => {
    await container.get(UpdateCustomerType).execute({
      uid: subscriberId,
      customerType: CustomerType.VIP,
    });

    // GIVEN
    dateMock.advanceTo(moment().add(1, 'month').toDate());
    await container.get(BillSubscriptions).execute();
    const scheduledBills = await container.get(GetBillBySubscriptionId).execute({
      subscriptionId,
    });
    expect(scheduledBills.length).toEqual(1);
    expect(scheduledBills[0].props.amount).toEqual(0);

    // WHEN
    await container.get(PayBills).execute();

    // THEN
    const takedBills = await container.get(GetBillBySubscriptionId).execute({
      subscriptionId,
    });
    expect(takedBills.length).toEqual(1);
    expect(takedBills[0].props.amount).toEqual(0);
    expect(takedBills[0].props.payedAt).toBeTruthy();
    await container.get(BillSubscriptions).execute();
    const results = await container
      .get<BillingRepository>(SubscriptionIdentifier.billingRepository)
      .getDueBills();
    expect(results.length).toEqual(0);
  });
});
