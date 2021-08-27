import 'reflect-metadata';
import { IdentityProvider } from '@oney/identity-core';
import { buildProfileAdapterLib, ProfileGenerator } from '@oney/profile-adapters';
import { AddressStep, Steps } from '@oney/profile-core';
import { Container } from 'inversify';
import * as nock from 'nock';
import { ServiceBusClient } from '@azure/service-bus';
import MockDate from 'mockdate';
import * as queryString from 'querystring';
import * as path from 'path';
import { config, identityConfig } from './fixtures/config';
import { legacyEvent, domainEvent } from './fixtures/address/events';

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/address`);
nockBack.setMode('record');

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

const container = new Container();

const before = (scope: any) => {
  // eslint-disable-next-line no-param-reassign
  scope.filteringRequestBody = (body: string, aRecordedBody: any) => {
    const { of: currentOffset } = queryString.parse(`?${body}`);
    const { of: recordedOffset } = queryString.parse(`?${body}`);
    if (!(currentOffset || recordedOffset)) {
      // Just replace the saved body by a new one
      // eslint-disable-next-line no-param-reassign
      delete aRecordedBody.orderid;
      return aRecordedBody;
    }
    if (currentOffset === recordedOffset) {
      return aRecordedBody;
    }
    return body;
  };
};

describe('Test suite for Address step', () => {
  let mockBusSend: jest.Mock;
  let addressStep: AddressStep;
  let userId: string;

  beforeAll(async () => {
    userId = 'AWzclPFyN';
    mockBusSend = (ServiceBusClient.createFromConnectionString(null).createTopicClient(null).createSender()
      .send as unknown) as jest.Mock;
    config.forceAzureServiceBus = true;
    await buildProfileAdapterLib(container, config, identityConfig);
    addressStep = container.get(AddressStep);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    const tipsDb = container.get(ProfileGenerator);
    await tipsDb.beforeAddressStepSnapshot(userId);
  });

  beforeEach(() => {
    MockDate.set(new Date('2021-02-18T00:00:00.000Z'));
    mockBusSend.mockClear();
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('Should validate Address step and send both domain and legacy events', async () => {
    const { nockDone } = await nockBack('completeAddressStep.json', { before });
    const result = await addressStep.execute(
      {
        street: 'Rue saint domingue',
        additionalStreet: 'appartement 00',
        city: 'Muerta Island',
        postalCode: '00000',
        country: 'MI',
      },
      {
        ipAddress: 'aaazzz',
        uid: userId,
        roles: [],
        name: 'user',
        provider: IdentityProvider.odb,
      },
    );
    expect(result.props.kyc.steps.includes(Steps.ADDRESS_STEP)).toBeFalsy();
    expect(mockBusSend).toHaveBeenCalledWith(domainEvent);
    expect(mockBusSend).toHaveBeenLastCalledWith(legacyEvent);

    nockDone();
  });
});
