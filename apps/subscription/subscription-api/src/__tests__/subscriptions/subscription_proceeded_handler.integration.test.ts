import 'reflect-metadata';
import './mocks/azureBus.mock';
import * as express from 'express';
import { Container } from 'inversify';
import { EnrollSubscriber, GetSubscriptionsBySubscriberId, SubscribeToOffer } from '@oney/subscription-core';
import { AttachCard } from '@oney/subscription-messages';
import { v4 } from 'uuid';
import * as path from 'path';
import { bootstrap } from '../config/bootstrap';
import { SubscriptionProceededHandler } from '../../modules/subscriptions/handlers/SubscriptionProceededHandler';

const app = express();

describe('INTEGRATION - SubscriptionProceededHandler', () => {
  let container: Container;
  let subscriberId: string;
  let subscriptionId: string;
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
      offerId: '0d84b88b-e93a-4de7-b52e-44eacd9e7b18',
    });
    subscriptionId = subscription.id;
  });

  it('Should handle offer subscribed saga on onboarding', async () => {
    // GIVEN
    const cardId = 'aaaa';

    // WHEN
    await container.resolve(SubscriptionProceededHandler).handle(
      new AttachCard({
        cardId,
        subscriptionId,
      }),
    );

    // THEN
    const subscriptions = await container.get(GetSubscriptionsBySubscriberId).execute({
      subscriberId,
    });
    expect(subscriptions[0].props.cardId).toEqual(cardId);
  });
});
