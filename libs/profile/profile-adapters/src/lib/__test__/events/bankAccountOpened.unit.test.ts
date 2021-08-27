import 'reflect-metadata';
import * as nock from 'nock';
import { Container } from 'inversify';
import { ServiceBusClient } from '@azure/service-bus';
import {
  BankAccountOpenedEventHandler,
  buildProfileAdapterLib,
  ProfileGenerator,
} from '@oney/profile-adapters';
import { Identifiers, ProfileRepositoryRead } from '@oney/profile-core';
import MockDate from 'mockdate';
import { defaultLogger } from '@oney/logger-adapters';
import { JSONConvert } from '@oney/common-core';
import { DomainEvent } from '@oney/ddd';
import * as path from 'path';
import { config, identityConfig } from '../fixtures/config';
import { mockedBankAccount } from '../fixtures/customerSituations/mockedBankAccount';
import { bankAccountOpenedDomainEvent } from '../fixtures/bankAccountOpenedEventHandler/createBankAccount.fixtures';
import { OneyB2BCustomerResponseMapper } from '../../adapters/mappers/OneyB2BCustomerResponseMapper';
import { OneyB2BContractGateway } from '../../adapters/gateways/OneyB2BContractGateway';

const container = new Container();

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

describe('Unit test suite for BankAccountOpened Handler', () => {
  const uid = 'beGe_flCm';
  const bankAccountOpenedEventMessage = JSONConvert.deserialize(
    bankAccountOpenedDomainEvent.body,
  ) as DomainEvent;
  let profileRepositoryRead: ProfileRepositoryRead;
  let saveFixture: Function;
  let mockBusSend: jest.Mock;
  let spy: jest.SpyInstance;

  beforeAll(async () => {
    mockBusSend = (ServiceBusClient.createFromConnectionString(null).createTopicClient(null).createSender()
      .send as unknown) as jest.Mock;
    spy = jest.spyOn(OneyB2BContractGateway.prototype, 'create');

    config.forceAzureServiceBus = true;
    await buildProfileAdapterLib(container, config, identityConfig);

    container.bind(ProfileGenerator).to(ProfileGenerator);

    const profileDb = container.get(ProfileGenerator);

    profileRepositoryRead = container.get<ProfileRepositoryRead>(Identifiers.profileRepositoryRead);

    await profileDb.getProfileForBankAccountCreatedEvent(uid);

    nock.back.fixtures = path.resolve(`${__dirname}/../fixtures/customerSituations`);
    nock.back.setMode('record');
  });

  beforeEach(async () => {
    MockDate.set(new Date('2020-12-10T00:00:00.000Z'));
    mockBusSend.mockClear();
    nock.restore();
    nock.activate();
    const { nockDone } = await nock.back(test.getFixtureName());
    saveFixture = nockDone;
  });

  afterEach(async () => {
    const nockObjects = nock.recorder.play();
    if (nockObjects.length == 0) {
      nock.restore();
    } else {
      console.log('saving nock fixture for: ', test.getFixtureName());
      saveFixture();
    }
  });

  it('Should update situation lead because bankAccountOpened event received', async () => {
    const bankAccountOpenedEventHandler = await new BankAccountOpenedEventHandler(
      false,
      container.get(Identifiers.contractGateway),
      container.get(Identifiers.getCustomerSituations),
      defaultLogger,
    );

    await bankAccountOpenedEventHandler.handle({
      id: mockedBankAccount.id,
      props: {
        uid: mockedBankAccount.props.uid,
        bid: mockedBankAccount.props.bankAccountId,
        iban: mockedBankAccount.props.iban,
        bic: mockedBankAccount.props.bic,
      },
    });

    const updatedProfile = await profileRepositoryRead.getUserById(uid);

    const customerSituations = new OneyB2BCustomerResponseMapper().toDomain({
      customer_flag: '0',
      internal_incidents: {
        store_credit_limit_blocked_flag: '0',
        vplus_credit_limit_blocked_flag: '0',
        reconfiguration_flag: '0',
        indebtedness_flag: '0',
      },
    });

    expect(updatedProfile.props.situation.lead).toEqual(customerSituations.lead);
    expect(spy).not.toBeCalled();
  });

  it('Should handle BANK ACCOUNT OPENED event and call OFR', async () => {
    const eventHandler = await new BankAccountOpenedEventHandler(
      config.providersConfig.oneyB2CConfig.featureFlagContract,
      container.get(Identifiers.contractGateway),
      container.get(Identifiers.getCustomerSituations),
      defaultLogger,
    );
    await eventHandler.handle({
      id: bankAccountOpenedEventMessage['domainEventProps'].id,
      props: {
        uid: bankAccountOpenedEventMessage['uid'],
        bid: bankAccountOpenedEventMessage['bid'],
        bic: bankAccountOpenedEventMessage['bic'],
        iban: bankAccountOpenedEventMessage['iban'],
      },
    });

    expect(spy).toBeCalled();
  });
});
