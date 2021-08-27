/* eslint-env jest */
import 'reflect-metadata';

import { buildProfileAdapterLib } from '@oney/profile-adapters';
import { GetProfessionalActivitiesList, ProfessionalCategoriesList } from '@oney/profile-core';
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

describe('Process getProfessionalActivitiesList unit testing', () => {
  let getProfessionalActivitiesList: GetProfessionalActivitiesList;

  beforeAll(async () => {
    config.forceAzureServiceBus = true;
    await buildProfileAdapterLib(container, config, identityConfig);

    getProfessionalActivitiesList = container.get(GetProfessionalActivitiesList);
  });

  it('should return the list of fiscal countries', async () => {
    const result = await getProfessionalActivitiesList.execute();
    expect(result).toEqual(ProfessionalCategoriesList);
  });
});
