import * as express from 'express';
import { Application } from 'express';
import { Container } from 'inversify';
import { ProfileGenerator } from '@oney/profile-adapters';
import { KycDecisionType, Steps } from '@oney/profile-core';
import { OfferType, SubscriptionCreated, SubscriptionStatus } from '@oney/subscription-messages';
import * as request from 'supertest';
import { EncodeIdentity, IdentityProvider } from '@oney/identity-core';
import { ProfileStatus } from '@oney/profile-messages';
import * as path from 'path';
import { configureApp, initRouter } from '../config/server/express';
import { SubscriptionCreatedHandler } from '../modules/onboarding/handlers/SubscriptionCreatedHandler';

const app: Application = express();

jest.mock('@azure/service-bus', () => ({
  ReceiveMode: {
    peekLock: 1,
    receiveAndDelete: 2,
  },
  ServiceBusClient: {
    createFromConnectionString: jest.fn().mockReturnValue({
      createTopicClient: jest.fn().mockReturnValue({
        createSender: jest.fn().mockReturnValue({
          send: jest.fn(),
        }),
      }),
      createSubscriptionClient: jest.fn().mockReturnValue({
        createReceiver: jest.fn().mockReturnValue({
          registerMessageHandler: jest.fn(),
        }),
      }),
    }),
  },
}));

describe('Subscription integration handlers testing', () => {
  let container: Container;
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/env/test.env');
    container = await configureApp(envPath, true);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    await initRouter(app, envPath);
  });

  it('Should validate subscription step on SubscriptionCreated event', async () => {
    const profile = await container
      .get(ProfileGenerator)
      .generate('hello', ProfileStatus.ON_BOARDING, 'toto', KycDecisionType.KO_MANUAL);
    const userToken = await container.get(EncodeIdentity).execute({
      uid: profile.props.uid,
      email: 'aaaa',
      provider: IdentityProvider.odb,
    });
    await request(app)
      .get(`/profile/user/${profile.props.uid}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
      .expect(res => {
        expect(res.body.steps.includes(Steps.SELECT_OFFER_STEP)).toBeTruthy();
      });
    const subscriptionCreatedHandler = container.get(SubscriptionCreatedHandler);
    await subscriptionCreatedHandler.handle({
      props: {
        offerId: 'test',
        subscriberId: profile.props.uid,
        subscriptionId: 'superSubscription',
        offerType: OfferType.ONEY_FIRST,
        status: SubscriptionStatus.PENDING_ACTIVATION,
      },
      id: 'azeazdazdazd',
      metadata: {
        aggregateId: profile.props.uid,
        aggregate: SubscriptionCreated.name,
      },
    });

    await request(app)
      .get(`/profile/user/${profile.props.uid}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
      .expect(res => {
        expect(res.body.steps.includes(Steps.SELECT_OFFER_STEP)).toBeFalsy();
      });
  });
});
