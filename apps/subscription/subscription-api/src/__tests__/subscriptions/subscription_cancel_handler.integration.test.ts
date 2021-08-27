import 'reflect-metadata';
import './mocks/azureBus.mock';
import * as express from 'express';
import { Container } from 'inversify';
import {
  CancelSubscriptionByOfferId,
  EnrollSubscriber,
  GetSubscriptionsBySubscriberId,
  SubscribeToOffer,
} from '@oney/subscription-core';
import { SubscriptionCancelled, SubscriptionStatus } from '@oney/subscription-messages';
import { v4 } from 'uuid';
import * as path from 'path';
import { bootstrap } from '../config/bootstrap';
import { SubscriptionCancelledHandler } from '../../modules/subscriptions/handlers/SubscriptionCancelledHandler';
import { SubscriptionSyms } from '../../config/di/SubscriptionSyms';

const app = express();

describe('INTEGRATION - SubscriptionCancelledHandler', () => {
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
    await container.get(SubscribeToOffer).execute({
      subscriberId: subscriberId,
      offerId,
    });
  });

  it('Should handle Cancelled Subscription and assign defaultOffer', async () => {
    //GIVEN
    await container.get(CancelSubscriptionByOfferId).execute({
      offerId,
      subscriberId,
    });

    // WHEN
    const cancelSubscriptionHandler = container.resolve(SubscriptionCancelledHandler);
    await cancelSubscriptionHandler.handle({
      props: {
        status: SubscriptionStatus.PENDING_CANCELLATION,
        subscriberId: subscriberId,
        offerId,
      },
      metadata: {
        aggregate: SubscriptionCancelled.name,
        aggregateId: 'azeaze',
      },
      id: 'paozejpozake',
      createdAt: new Date(),
    });

    // THEN
    const defaultOffer = container.get(SubscriptionSyms.defaultOffer);
    const getSubscriptionByOfferId = await container.get(GetSubscriptionsBySubscriberId).execute({
      subscriberId: subscriberId,
    });
    expect(getSubscriptionByOfferId[1].props.offerId).toEqual(defaultOffer);
  });

  it('Should do nothing because defaultOffer was cancelled', async () => {
    const cancelSubscriptionHandler = container.resolve(SubscriptionCancelledHandler);
    const defaultOffer = container.get<string>(SubscriptionSyms.defaultOffer);
    await cancelSubscriptionHandler.handle({
      props: {
        status: SubscriptionStatus.PENDING_CANCELLATION,
        subscriberId: subscriberId,
        offerId: defaultOffer,
      },
      metadata: {
        aggregate: SubscriptionCancelled.name,
        aggregateId: 'azeaze',
      },
      id: 'paozejpozake',
      createdAt: new Date(),
    });
  });
});
