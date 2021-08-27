import 'reflect-metadata';
import './mocks/azureBus.mock';
import * as express from 'express';
import { Container } from 'inversify';
import {
  ActivateSubscriber,
  EnrollSubscriber,
  GetSubscriptionsBySubscriberId,
  SubscribeToOffer,
} from '@oney/subscription-core';
import { SubscriberActivated, SubscriptionStatus } from '@oney/subscription-messages';
import { v4 } from 'uuid';
import * as path from 'path';
import { bootstrap } from '../config/bootstrap';
import { SubscriberActivatedHandler } from '../../modules/subscriptions/handlers/SubscriberActivatedHandler';

const app = express();

describe('INTEGRATION - SubscriberActivatedHandler', () => {
  let container: Container;
  let subscriberId: string;
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
      offerId: '0d84b88b-e93a-4de7-b52e-44eacd9e7b18',
    });

    await container.get(ActivateSubscriber).execute({
      uid: subscriberId,
      isValidated: true,
    });
  });

  it('Should activate subscription', async () => {
    const subscriptionActivatedHandler = container.resolve(SubscriberActivatedHandler);
    const subscriberActivated = new SubscriberActivated({
      activatedAt: new Date(),
    });

    subscriberActivated.metadata = {
      aggregateId: subscriberId,
      aggregate: SubscriberActivated.name,
    };

    const onSubscriptionActivated = subscriptionActivatedHandler.handle(subscriberActivated);

    await expect(onSubscriptionActivated).resolves.not.toThrow();

    const subscription = await container.get(GetSubscriptionsBySubscriberId).execute({
      subscriberId: subscriberId,
    });
    expect(subscription.length).toEqual(1);
    expect(subscription[0].props.activationDate).toBeTruthy();
    expect(subscription[0].props.nextBillingDate).toBeTruthy();
    expect(subscription[0].props.status).toEqual(SubscriptionStatus.ACTIVE);
  });
});
