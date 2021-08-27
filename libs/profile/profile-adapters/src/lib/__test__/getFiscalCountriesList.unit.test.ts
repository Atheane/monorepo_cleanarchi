/* eslint-env jest */
import 'reflect-metadata';

import { buildProfileAdapterLib } from '@oney/profile-adapters';
import { GetFiscalCountriesList, FiscalCountriesList } from '@oney/profile-core';
import { Container } from 'inversify';
import { config, identityConfig } from './fixtures/config';

const container = new Container();

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

describe('Process getFiscalCountriesList unit testing', () => {
  let getFiscalCountriesList: GetFiscalCountriesList;

  beforeAll(async () => {
    config.forceAzureServiceBus = true;
    await buildProfileAdapterLib(container, config, identityConfig);

    getFiscalCountriesList = container.get(GetFiscalCountriesList);
  });

  it('should return the list of fiscal countries', async () => {
    const result = await getFiscalCountriesList.execute();
    expect(result).toEqual(FiscalCountriesList);
  });
});
