import 'reflect-metadata';
import { beforeAll, describe } from '@jest/globals';
import { Container } from 'inversify';
import { EnrollSubscriber, UpdateCustomerType } from '@oney/subscription-core';
import { CustomerType } from '@oney/subscription-messages';
import {
  inMemoryBusModule,
  inMemorySubscriptionImplems,
  subscriptionModule,
} from '../../adapters/SubscriptionModule';

const container = new Container();
const subscriberStore = new Map();
describe('Unit - CustomerType', () => {
  beforeAll(() => {
    container.load(
      subscriptionModule,
      inMemorySubscriptionImplems({
        subscriberDb: subscriberStore,
        billDb: new Map(),
        subscriptionDb: new Map(),
      }),
      inMemoryBusModule(container),
    );
  });

  afterEach(() => {
    subscriberStore.clear();
  });

  beforeEach(async () => {
    await container.get(EnrollSubscriber).execute({
      uid: 'other',
    });
  });

  it('Should Update customerType', async () => {
    const result = await container.get(UpdateCustomerType).execute({
      customerType: CustomerType.COLLABORATOR,
      uid: 'other',
    });
    expect(result.props.customerType).toEqual(CustomerType.COLLABORATOR);
  });
});
