import 'reflect-metadata';
import { beforeAll, describe } from '@jest/globals';
import { Container } from 'inversify';
import { GetOffers } from '@oney/subscription-core';
import { inMemoryBusModule, subscriptionModule } from '../../adapters/SubscriptionModule';

const container = new Container();

describe('Unit - Offers', () => {
  beforeAll(() => {
    container.load(subscriptionModule, inMemoryBusModule(container));
  });

  it('Should get all offers', async () => {
    const result = await container.get(GetOffers).execute();
    expect(result.map(item => item.props)).toBeTruthy();
  });
});
