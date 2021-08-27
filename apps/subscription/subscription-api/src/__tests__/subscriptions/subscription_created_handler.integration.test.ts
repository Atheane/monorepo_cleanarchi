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
import { OfferType, SubscriptionCreated, SubscriptionStatus } from '@oney/subscription-messages';
import { v4 } from 'uuid';
import * as path from 'path';
import { bootstrap } from '../config/bootstrap';
import { SubscriptionSyms } from '../../config/di/SubscriptionSyms';
import { SubscriptionCreatedHandler } from '../../modules/subscriptions/handlers/SubscriptionCreatedHandler';

const app = express();

describe('INTEGRATION - SubscriptionCreatedHandler', () => {
  let container: Container;
  let subscriberId: string;
  let defaultOffer: string;
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/../env/test.env');
    container = await bootstrap(app, envPath, process.env.MONGO_URL);
  });

  beforeEach(async () => {
    subscriberId = v4() + new Date().getTime().toString();
    defaultOffer = container.get<string>(SubscriptionSyms.defaultOffer);
    await container.get(EnrollSubscriber).execute({
      uid: subscriberId,
    });
  });

  it('Should handle default offer subscribed', async () => {
    // GIVEN
    const sub = await container.get(SubscribeToOffer).execute({
      subscriberId: subscriberId,
      offerId: defaultOffer,
    });

    // WHEN
    const subscriptionCreatedHandler = container.resolve(SubscriptionCreatedHandler);

    await subscriptionCreatedHandler.handle({
      metadata: {
        aggregateId: 'subscriptionidentifier',
        aggregate: SubscriptionCreated.name,
      },
      props: {
        offerType: OfferType.ACCOUNT_FEE,
        status: SubscriptionStatus.PENDING_ACTIVATION,
        offerId: defaultOffer,
        subscriptionId: sub.id,
        subscriberId: subscriberId,
      },
      id: 'aozekazpomke',
    });

    // THEN
    const result = await container.get(GetSubscriptionsBySubscriberId).execute({
      subscriberId: subscriberId,
    });
    expect(result[0].props.offerId).toEqual(defaultOffer);
    expect(result[0].props.activationDate).toBeFalsy();
  });

  it('Should cancel defaultOffer after new offer has been subscribed', async () => {
    // GIVEN
    const offerId = '0d84b88b-e93a-4de7-b52e-44eacd9e7b18';
    await container.get(SubscribeToOffer).execute({
      subscriberId,
      offerId: defaultOffer,
    });

    // WHEN
    const subscriptionCreatedHandler = container.resolve(SubscriptionCreatedHandler);

    const newSubscription = await container.get(SubscribeToOffer).execute({
      subscriberId,
      offerId,
    });
    await subscriptionCreatedHandler.handle({
      metadata: {
        aggregateId: 'subscriptionidentifier',
        aggregate: SubscriptionCreated.name,
      },
      props: {
        status: SubscriptionStatus.PENDING_ACTIVATION,
        offerType: OfferType.ONEY_ORIGINAL,
        offerId,
        subscriptionId: newSubscription.id,
        subscriberId,
      },
      id: 'aozekazpomke',
    });
    const subscriptions = await container.get(GetSubscriptionsBySubscriberId).execute({
      subscriberId,
    });
    expect(subscriptions[1].props.offerId).toEqual(offerId);
    expect(subscriptions[1].props.activationDate).toBeFalsy();
    expect(subscriptions.length).toEqual(2);

    // Default offer cancelled.
    expect(subscriptions[0].props.offerId).toEqual(defaultOffer);
    expect(subscriptions[0].props.endDate).toBeTruthy();
  });

  it('[POSTONBOARDING] Should order card even if subscription already cancelled', async () => {
    // GIVEN
    const offerId = '0d84b88b-e93a-4de7-b52e-44eacd9e7b18';
    await container.get(SubscribeToOffer).execute({
      subscriberId,
      offerId: defaultOffer,
    });

    await container.get(CancelSubscriptionByOfferId).execute({
      offerId: defaultOffer,
      subscriberId,
    });

    // WHEN
    const subscriptionCreatedHandler = container.resolve(SubscriptionCreatedHandler);

    const newSubscription = await container.get(SubscribeToOffer).execute({
      subscriberId,
      offerId,
    });
    await subscriptionCreatedHandler.handle({
      metadata: {
        aggregateId: 'subscriptionidentifier',
        aggregate: SubscriptionCreated.name,
      },
      props: {
        status: SubscriptionStatus.PENDING_ACTIVATION,
        offerType: OfferType.ONEY_ORIGINAL,
        offerId,
        subscriptionId: newSubscription.id,
        subscriberId,
      },
      id: 'aozekazpomke',
    });
  });
});
