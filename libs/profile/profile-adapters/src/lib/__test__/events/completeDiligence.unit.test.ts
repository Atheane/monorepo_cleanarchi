/* eslint-env jest */
import 'reflect-metadata';

import { ServiceBusClient } from '@azure/service-bus';
import { buildProfileAdapterLib, ProfileGenerator } from '@oney/profile-adapters';
import {
  CallbackType,
  CompleteDiligence,
  DiligenceSctInCallbackPayloadProperties,
  DiligenceStatus,
  DiligencesType,
} from '@oney/profile-core';
import { Container } from 'inversify';
import MockDate from 'mockdate';
import { ProfileStatus } from '@oney/profile-messages';
import { config, identityConfig } from '../fixtures/config';
import {
  activateDomainEvent,
  completeDomainEvent,
  updatedStatusCompleteDomainEvent,
  updatedStatusRefusedDomainEvent,
} from '../fixtures/completeDiligence/events';

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

jest.mock('uuid', () => ({
  v4: () => 'uuid_v4_example',
}));

describe('Process diligence sct in callback unit testing', () => {
  let completeDiligence: CompleteDiligence;
  let profileDb: ProfileGenerator;
  let mockBusSend: jest.Mock;

  const uid = 'xWr-VutjI';

  beforeAll(async () => {
    config.forceAzureServiceBus = true;
    await buildProfileAdapterLib(container, config, identityConfig);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    profileDb = container.get(ProfileGenerator);
    completeDiligence = container.get(CompleteDiligence);
    mockBusSend = (ServiceBusClient.createFromConnectionString(null).createTopicClient(null).createSender()
      .send as unknown) as jest.Mock;
  });

  beforeEach(async () => {
    MockDate.set(new Date('2021-02-18T00:00:00.000Z'));
    await profileDb.generate(uid, ProfileStatus.ON_HOLD);
    mockBusSend.mockClear();
  });

  it('should validate user when a valid diligence sct in is triggered', async () => {
    const message: DiligenceSctInCallbackPayloadProperties = {
      type: CallbackType.DILIGENCE_SCT_IN,
      status: DiligenceStatus.VALIDATED,
      appUserId: 'xWr-VutjI',
      diligenceType: DiligencesType.SCTIN,
      amount: 100,
      transferDate: new Date('2020-07-03T22:00:00+00:00'),
      transmitterFullname: 'Jess Donnelly',
    };
    const result = await completeDiligence.execute(message);
    expect(result.props.informations.status).toEqual(ProfileStatus.ACTIVE);
    expect(mockBusSend).toHaveBeenNthCalledWith(1, updatedStatusCompleteDomainEvent);
    expect(mockBusSend).toHaveBeenNthCalledWith(2, completeDomainEvent);
    expect(mockBusSend).toHaveBeenNthCalledWith(3, activateDomainEvent);
  });

  it('should refuse user when a not valid diligence sct in is triggered', async () => {
    const message: DiligenceSctInCallbackPayloadProperties = {
      type: CallbackType.DILIGENCE_SCT_IN,
      status: DiligenceStatus.REFUSED,
      appUserId: 'xWr-VutjI',
      diligenceType: DiligencesType.SCTIN,
      amount: 100,
      transferDate: new Date('2020-07-03T22:00:00+00:00'),
      transmitterFullname: 'Jess Donnelly',
    };
    const result = await completeDiligence.execute(message);
    expect(result.props.informations.status).toEqual(ProfileStatus.ACTION_REQUIRED_ACTIVATE);
    expect(mockBusSend).toHaveBeenCalledWith(updatedStatusRefusedDomainEvent);
    expect(mockBusSend).not.toHaveBeenCalledWith(completeDomainEvent);
    expect(mockBusSend).not.toHaveBeenCalledWith(activateDomainEvent);
  });
});
