import 'reflect-metadata';
import './mocks/azureBus.mock';
import * as express from 'express';
import { Container } from 'inversify';
import { EnrollSubscriber, SubscribeToOffer } from '@oney/subscription-core';
import { OfferType, SubscriptionCreated, SubscriptionStatus } from '@oney/subscription-messages';
import { BankAccountOpened, CardCreated, CardType } from '@oney/payment-messages';
import { Connection } from 'mongoose';
import { v4 } from 'uuid';
import * as path from 'path';
import { bootstrap } from '../config/bootstrap';
import { sagaInitialize } from '../config/sagaInitialize';
import { SubscriptionSyms } from '../../config/di/SubscriptionSyms';
import { OfferSubscribedSagas } from '../../modules/subscriptions/sagas/OfferSubscribedSagas';

const app = express();

describe('INTEGRATION - OfferSubscribedSagas', () => {
  let container: Container;
  let services;
  let subscriberId: string;
  let subscriptionId: string;
  const offerId = '0d84b88b-e93a-4de7-b52e-44eacd9e7b18';
  beforeAll(async () => {
    const envPath = path.resolve(__dirname + '/../env/test.env');
    container = await bootstrap(app, envPath, process.env.MONGO_URL);
    services = await sagaInitialize(
      container.get(Connection),
      r => {
        r.register(OfferSubscribedSagas);
      },
      container,
    );
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
    subscriptionId = subscription.id;
  });

  it('Should handle onboarding workflow', async () => {
    // We dispatch an EventSubscriptionCreated.
    await services.dispatch(
      new SubscriptionCreated({
        status: SubscriptionStatus.PENDING_ACTIVATION,
        offerType: OfferType.VISA_CLASSIC,
        subscriberId,
        subscriptionId,
        offerId,
      }),
    );
    const result = await services.getAllActiveSagaBySaga(OfferSubscribedSagas);
    expect(result[0].instance.state.subscriberId).toEqual(subscriberId);

    await services.dispatch(
      new BankAccountOpened({
        uid: subscriberId,
        bic: 'azopek',
        bid: 'aze',
        iban: 'azeazezae',
      }),
    );
    // OrderCard command send
    const bankAccount = await services.getAllActiveSagaBySaga(OfferSubscribedSagas);
    expect(bankAccount[0].instance.state.subscriberId).toEqual(subscriberId);

    await services.dispatch(
      new CardCreated({
        ownerId: subscriberId,
        id: 'aaaa',
        pan: 'azeaze',
        ref: 'azeaze',
        status: 'ordered' as any,
        type: CardType.PHYSICAL_CLASSIC,
      }),
    );
    // Finish the saga flow.
    const cardCreated = await services.getAllActiveSagaBySaga(OfferSubscribedSagas);
    expect(cardCreated.length).toEqual(0);
  });

  it('Should handle default offer subscribed', async () => {
    const defaultOffer = container.get<string>(SubscriptionSyms.defaultOffer);
    // We dispatch an EventSubscriptionCreated.
    await services.dispatch(
      new SubscriptionCreated({
        status: SubscriptionStatus.PENDING_ACTIVATION,
        offerType: OfferType.ACCOUNT_FEE,
        subscriberId,
        subscriptionId,
        offerId: defaultOffer,
      }),
    );
    const result = await services.getAllActiveSagaBySaga(OfferSubscribedSagas);
    expect(result.length).toEqual(0);
  });

  it('Should handle subscriber already activated', async () => {
    // We dispatch an EventSubscriptionCreated.
    await services.dispatch(
      new SubscriptionCreated({
        status: SubscriptionStatus.ACTIVE,
        offerType: OfferType.ONEY_FIRST,
        subscriberId,
        subscriptionId,
        offerId,
      }),
    );
    await services.dispatch(
      new CardCreated({
        ownerId: subscriberId,
        id: 'aaaa',
        pan: 'azeaze',
        ref: 'azeaze',
        status: 'ordered' as any,
        type: CardType.PHYSICAL_CLASSIC,
      }),
    );
    const result = await services.getAllActiveSagaBySaga(OfferSubscribedSagas);
    expect(result.length).toEqual(0);
  });
});
