import 'reflect-metadata';
import { buildProfileAdapterLib, PreEligibilityOKEventHandler } from '@oney/profile-adapters';
import { GetFicpFcc } from '@oney/profile-core';
import { Container } from 'inversify';
import { ServiceBusClient } from '@azure/service-bus';
import { SymLogger } from '@oney/logger-core';
import MockDate from 'mockdate';
import { config, identityConfig } from '../fixtures/config';

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

describe('Test suite for preEligibilityOK event handler', () => {
  let mockBusSend: jest.Mock;
  let userId: string;
  let spyFicpFccInstance: jest.SpyInstance;

  beforeAll(async () => {
    userId = 'AWzclPFyN';
    mockBusSend = (ServiceBusClient.createFromConnectionString(null).createTopicClient(null).createSender()
      .send as unknown) as jest.Mock;
    spyFicpFccInstance = jest.spyOn(GetFicpFcc.prototype, 'execute');
    await buildProfileAdapterLib(container, config, identityConfig);
  });

  beforeEach(() => {
    mockBusSend.mockClear();
    spyFicpFccInstance.mockClear();
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('Should handle PRE ELIGIBILITY OK event', async () => {
    spyFicpFccInstance.mockImplementation(() => Promise.resolve());
    const eventHandler = new PreEligibilityOKEventHandler(
      container.get(GetFicpFcc),
      container.get(SymLogger),
    );
    await eventHandler.handle({
      id: 'uuid_v4_example',
      props: {
        uId: userId,
        timestamp: new Date('2020-12-10T00:00:00.000Z'),
      },
    });

    expect(spyFicpFccInstance).toBeCalled();
  });
});
