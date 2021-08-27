/**
 * @jest-environment node
 */
import 'reflect-metadata';
import { beforeAll, describe } from '@jest/globals';
import { Container } from 'inversify';
import {
  EnrollSubscriber,
  GetSubscriberById,
  SubscriberErrors,
  SubscriberRepository,
  SubscriptionIdentifier,
} from '@oney/subscription-core';
import { CustomerType } from '@oney/subscription-messages';
import { invalidOffers } from '../fixtures/invalidOffers';
import {
  inMemoryBusModule,
  inMemorySubscriptionImplems,
  subscriptionModule,
} from '../../adapters/SubscriptionModule';
import { offers } from '../../adapters/partners/odb/offers/offers';

invalidOffers.map(item => offers.push(item));

const getSubscriber = async (container: Container, id: string) => {
  const result = await container
    .get<SubscriberRepository>(SubscriptionIdentifier.subscriberRepository)
    .getById(id);
  return result;
};

const container = new Container();
const subscriberStore = new Map();
const subscriptionStore = new Map();
describe('Unit - EnrollSubscriber', () => {
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
  });

  it('Should create a subscriber', async () => {
    await container.get(EnrollSubscriber).execute({
      uid: 'hello',
    });
    const result = await getSubscriber(container, 'hello');
    expect(result.props.uid).toEqual('hello');
    expect(result.props.customerType).toEqual(CustomerType.DEFAULT);
  });

  it('Should not re-create a subscriber', async () => {
    await container.get(EnrollSubscriber).execute({
      uid: 'hello',
    });
    const subscriber = await getSubscriber(container, 'hello');
    expect(subscriber.props.uid).toEqual('hello');
    expect(subscriber.props.customerType).toEqual(CustomerType.DEFAULT);
    const result = container.get(EnrollSubscriber).execute({
      uid: 'hello',
    });
    await expect(result).rejects.toThrow(SubscriberErrors.SubscriberAlreadyExist);
  });

  it('Should throw cause subscriber does not exist', async () => {
    const result = container.get(GetSubscriberById).execute({
      uid: 'hello',
    });
    await expect(result).rejects.toThrow(SubscriberErrors.SubscriberNotFound);
  });
});
