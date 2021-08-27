import 'reflect-metadata';
import './mocks/azureBus.mock';
import * as express from 'express';
import { Container } from 'inversify';
import {
  ActivateSubscription,
  CancelSubscriptionByOfferId,
  EnrollSubscriber,
  GetSubscriptionsBySubscriberId,
  SubscribeToOffer,
} from '@oney/subscription-core';
import { BillScheduled, SubscriptionStatus } from '@oney/subscription-messages';
import { v4 } from 'uuid';
import * as moment from 'moment';
import * as datemock from 'jest-date-mock';
import * as path from 'path';
import { bootstrap } from '../config/bootstrap';
import { BillOrderedHandler } from '../../modules/billings/handlers/BillOrderedHandler';

const app = express();

describe('INTEGRATION - BillPaidHandler', () => {
  let container: Container;
  let subscriberId: string;
  const offerId = '0d84b88b-e93a-4de7-b52e-44eacd9e7b18';
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/../env/test.env');
    container = await bootstrap(app, envPath, process.env.MONGO_URL);
  });

  beforeEach(async () => {
    subscriberId = v4() + new Date().getTime().toString();
    await container.get(EnrollSubscriber).execute({
      uid: subscriberId,
    });
    const subscription = await container.get(SubscribeToOffer).execute({
      subscriberId,
      offerId,
    });
    await container.get(ActivateSubscription).execute({
      subscriptionId: subscription.id,
    });
  });

  afterEach(() => {
    datemock.clear();
  });

  it('Should update subscriptionStatus after last bill taken', async () => {
    // GIVEN
    datemock.advanceTo(moment().add(1, 'month').toDate());
    await container.get(CancelSubscriptionByOfferId).execute({
      offerId,
      subscriberId,
    });

    // WHEN
    await container.resolve(BillOrderedHandler).handle({
      props: {
        offerId,
        orderId: '',
        uid: subscriberId,
        amount: 0,
      },
      id: 'azezae',
      metadata: {
        aggregate: BillScheduled.name,
        aggregateId: subscriberId,
      },
      createdAt: new Date(),
    });

    // THEN
    const subscriptionsCancelled = await container.get(GetSubscriptionsBySubscriberId).execute({
      subscriberId,
    });
    expect(subscriptionsCancelled[0].props.status).toEqual(SubscriptionStatus.CANCELLED);
  });

  it('Should update nextBillingDate after bill has been taken', async () => {
    // GIVEN
    const beforeUpdate = await container.get(GetSubscriptionsBySubscriberId).execute({
      subscriberId: subscriberId,
    });
    const month_plus_one = moment().add(1, 'month').format('DD-MM-YYYY');
    const beforeUpdateDate = beforeUpdate[0].props.nextBillingDate;
    expect(moment(beforeUpdateDate).format('DD-MM-YYYY')).toEqual(month_plus_one);

    // WHEN
    await container.resolve(BillOrderedHandler).handle({
      props: {
        offerId,
        orderId: '',
        uid: subscriberId,
        amount: 0,
      },
      id: 'azezae',
      metadata: {
        aggregate: BillScheduled.name,
        aggregateId: subscriberId,
      },
      createdAt: new Date(),
    });

    // THEN
    const afterUpdate = await container.get(GetSubscriptionsBySubscriberId).execute({
      subscriberId: subscriberId,
    });
    const month_plus_beforeUpdate = moment(beforeUpdateDate).add(1, 'month').toDate();
    expect(moment(month_plus_beforeUpdate).format('DD-MM-YYYY')).toEqual(
      moment(afterUpdate[0].props.nextBillingDate).format('DD-MM-YYYY'),
    );
  });
});
