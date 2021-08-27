import 'reflect-metadata';
import './mocks/azureBus.mock';
import * as express from 'express';
import { Container } from 'inversify';
import {
  ActivateSubscription,
  EnrollSubscriber,
  GetSubscriptionsBySubscriberId,
  ProcessSubscription,
  SubscribeToOffer,
} from '@oney/subscription-core';
import { CardStatus, CardStatusUpdated, CardType } from '@oney/payment-messages';
import { v4 } from 'uuid';
import * as path from 'path';
import { bootstrap } from '../config/bootstrap';
import { CardStatusUpdatedHandler } from '../../modules/subscriptions/handlers/CardStatusUpdatedHandler';

const app = express();

describe('INTEGRATION - CardStatusUpdatedHandler', () => {
  let container: Container;
  const offerId = '0d84b88b-e93a-4de7-b52e-44eacd9e7b18';
  let subscriptionId: string;
  let userId: string;
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/../env/test.env');
    container = await bootstrap(app, envPath, process.env.MONGO_URL);
  });

  beforeEach(async () => {
    userId = v4() + new Date().getTime().toString();
    await container.get(EnrollSubscriber).execute({
      uid: userId,
    });

    const subscription = await container.get(SubscribeToOffer).execute({
      subscriberId: userId,
      offerId,
    });
    await container.get(ActivateSubscription).execute({
      subscriptionId: subscription.id,
    });
    subscriptionId = subscription.id;
  });

  it('Should cancel subscription if card opposed', async () => {
    await container.get(ProcessSubscription).execute({
      cardId: 'aaa',
      subscriptionId: subscriptionId,
    });
    // WHEN
    await container.resolve(CardStatusUpdatedHandler).handle({
      id: 'azeaze',
      metadata: {
        aggregateId: 'aaa',
        aggregate: CardStatusUpdated.name,
      },
      props: {
        id: 'aaa',
        status: CardStatus.OPPOSED,
        ref: 'aze',
        type: CardType.PHYSICAL_CLASSIC,
        userId: userId,
      },
    });
    const subscriptionsCancelled = await container.get(GetSubscriptionsBySubscriberId).execute({
      subscriberId: userId,
    });
    expect(subscriptionsCancelled[0].props.endDate).toBeTruthy();
  });

  it('Should not cancel if card not opposed', async () => {
    // Should do nothing
    await container.resolve(CardStatusUpdatedHandler).handle({
      id: 'azeaze',
      metadata: {
        aggregateId: 'aaa',
        aggregate: CardStatusUpdated.name,
      },
      props: {
        id: 'aaa',
        status: CardStatus.ACTIVATED,
        ref: 'aze',
        type: CardType.PHYSICAL_CLASSIC,
        userId: userId,
      },
    });

    const subscriptionsCancelled = await container.get(GetSubscriptionsBySubscriberId).execute({
      subscriberId: userId,
    });
    expect(subscriptionsCancelled[0].props.endDate).toBeFalsy();
  });
});
