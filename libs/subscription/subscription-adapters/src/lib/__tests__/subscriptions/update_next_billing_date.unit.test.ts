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
  UpdateSubscriptionNextBillingDate,
} from '@oney/subscription-core';
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
describe('Unit - UpdateNextBillingDate', () => {
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
      offerId: '0d84b88b-e93a-4de7-b52e-44eacd9e7b18',
      subscriberId: 'zzz',
    });
    await container.get(ActivateSubscription).execute({
      subscriptionId: result.id,
    });
  });

  it('Should update subscription next billing date', async () => {
    // GIVEN
    const beforeUpdate = await container.get(GetSubscriptionsBySubscriberId).execute({
      subscriberId: 'zzz',
    });
    const month_plus_one = moment().add(1, 'month').format('DD-MM-YYYY');
    const beforeUpdateDate = beforeUpdate[0].props.nextBillingDate;
    expect(moment(beforeUpdateDate).format('DD-MM-YYYY')).toEqual(month_plus_one);

    // WHEN
    await container.get(UpdateSubscriptionNextBillingDate).execute({
      subscriberId: 'zzz',
      offerId: '0d84b88b-e93a-4de7-b52e-44eacd9e7b18',
    });
    const result = await container.get(GetSubscriptionsBySubscriberId).execute({
      subscriberId: 'zzz',
    });

    // THEN
    const month_plus_beforeUpdate = moment(beforeUpdateDate).add(1, 'month').toDate();
    expect(moment(month_plus_beforeUpdate).format('DD-MM-YYYY')).toEqual(
      moment(result[0].props.nextBillingDate).format('DD-MM-YYYY'),
    );
  });

  it('Should ', async () => {
    await container.get(GetSubscriptionsBySubscriberId).execute({
      subscriberId: 'aaa',
    });
  });
});
