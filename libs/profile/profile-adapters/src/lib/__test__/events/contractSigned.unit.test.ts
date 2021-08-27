import 'reflect-metadata';
import { defaultLogger } from '@oney/logger-adapters';
import * as nock from 'nock';
import { Container } from 'inversify';
import { ServiceBusClient } from '@azure/service-bus';
import { buildProfileAdapterLib, ProfileGenerator } from '@oney/profile-adapters';
import { Identifiers } from '@oney/profile-core';
import { DomainEvent } from '@oney/ddd';
import { JSONConvert } from '@oney/common-core';
import * as path from 'path';
import { config, identityConfig } from '../fixtures/config';
import { domainEventContractSigned } from '../fixtures/contract/events';
import { OneyB2BContractGateway } from '../../adapters/gateways/OneyB2BContractGateway';
import { ContractSignedHandler } from '../../adapters/events/profile/ContractSignedHandler';

const container = new Container();
const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/../fixtures/contractSignedEventHandler`);
nockBack.setMode('record');

jest.mock('uuid', () => ({
  v4: () => 'uuid_v4_example',
}));

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

describe('Unit test suite for Contract Signed Handler', () => {
  const uid = 'AWzclPFyN';
  const contractSignedEventMessage = JSONConvert.deserialize(domainEventContractSigned.body) as DomainEvent;
  let mockBusSend: jest.Mock;
  let spy: jest.SpyInstance;

  beforeAll(async () => {
    mockBusSend = (ServiceBusClient.createFromConnectionString(null).createTopicClient(null).createSender()
      .send as unknown) as jest.Mock;
    spy = jest.spyOn(OneyB2BContractGateway.prototype, 'update');
    await buildProfileAdapterLib(
      container,
      {
        ...config,
        providersConfig: {
          ...config.providersConfig,
          oneyB2CConfig: {
            ...config.providersConfig.oneyB2CConfig,
            featureFlagContract: true,
          },
        },
      },
      identityConfig,
    );
    container.bind(ProfileGenerator).to(ProfileGenerator);
    const profileDb = container.get(ProfileGenerator);
    await profileDb.beforeContractStepSnapshot(uid);
  });

  beforeEach(async () => {
    mockBusSend.mockClear();
    nock.cleanAll();
  });

  it('Should handle CONTRACT SIGNED event and call OFR', async () => {
    const { nockDone } = await nockBack('contractSignedEventHandler.json');
    const eventHandler = await new ContractSignedHandler(
      container.get(Identifiers.profileRepositoryRead),
      true,
      container.get(Identifiers.bankAccountGateway),
      container.get(Identifiers.contractGateway),
      defaultLogger,
    );
    console.log(contractSignedEventMessage);
    await eventHandler.handle({
      id: contractSignedEventMessage['domainEventProps'].id,
      props: {
        date: contractSignedEventMessage['date'],
      },
      metadata: contractSignedEventMessage['domainEventProps'].metadata,
    });

    expect(spy).toBeCalledWith({ bankAccountId: '3915', date: '2021-02-18T00:00:00.000Z' });

    nockDone();
  });
});
