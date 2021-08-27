import 'reflect-metadata';
import { buildProfileAdapterLib, ProfileGenerator } from '@oney/profile-adapters';
import { GetFicpFcc, Situation } from '@oney/profile-core';
import { Container } from 'inversify';
import MockDate from 'mockdate';
import { ServiceBusClient } from '@azure/service-bus';
import * as httpStatus from 'http-status';
import { ProfileStatus } from '@oney/profile-messages';
import { config, identityConfig } from './fixtures/config';
import {
  CallFccFailed,
  FccFlagFalse,
  FccFlagTrue,
  FicpFlagNoLead,
  FicpFlagTrue,
} from './fixtures/getFicpFcc/FicpFccCalculatedEvent';
import { OneyFicpGateway } from '../adapters/gateways/OneyFicpGateway';
import { OneyFccGateway } from '../adapters/gateways/OneyFccGateway';

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

describe('Test suite for GetFicpFcc', () => {
  const container = new Container();
  let mockBusSend: jest.Mock;
  let getFicpFcc: GetFicpFcc;
  let profileGenerator: ProfileGenerator;
  const userId = 'AWzclPFyN';

  const ficpGatewaySpy: any = {};
  const fccGatewaySpy: any = {};

  const situation: Situation = {
    lead: false,
    staff: false,
    vip: false,
  };

  beforeAll(async () => {
    mockBusSend = (ServiceBusClient.createFromConnectionString(null).createTopicClient(null).createSender()
      .send as unknown) as jest.Mock;
    ficpGatewaySpy.getRequestId = jest.spyOn(OneyFicpGateway.prototype, 'getRequestId');
    ficpGatewaySpy.getFlag = jest.spyOn(OneyFicpGateway.prototype, 'getFlag');
    fccGatewaySpy.getRequestId = jest.spyOn(OneyFccGateway.prototype, 'getRequestId');
    fccGatewaySpy.getFlag = jest.spyOn(OneyFccGateway.prototype, 'getFlag');

    config.forceAzureServiceBus = true;
    await buildProfileAdapterLib(container, config, identityConfig);
    getFicpFcc = container.get(GetFicpFcc);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    profileGenerator = container.get(ProfileGenerator);
    await profileGenerator.generate(userId, ProfileStatus.ON_BOARDING);
  });

  beforeEach(async () => {
    MockDate.set(new Date('2021-02-18T00:00:00.000Z'));
    mockBusSend.mockClear();
    ficpGatewaySpy.getRequestId.mockClear();
    ficpGatewaySpy.getFlag.mockClear();
    fccGatewaySpy.getRequestId.mockClear();
    fccGatewaySpy.getFlag.mockClear();
  });

  it('should send event FicpFccCalculated. call api to get ficp request id failed', async () => {
    await profileGenerator.addSituation(userId, { ...situation, lead: true });
    ficpGatewaySpy.getRequestId = ficpGatewaySpy.getRequestId.mockImplementation(() =>
      Promise.resolve({ status: httpStatus.INTERNAL_SERVER_ERROR, result: undefined }),
    );
    fccGatewaySpy.getRequestId = fccGatewaySpy.getRequestId.mockImplementation(() =>
      Promise.resolve({ status: httpStatus.OK, result: 12345 }),
    );
    fccGatewaySpy.getFlag = fccGatewaySpy.getFlag.mockImplementation(() =>
      Promise.resolve({ status: httpStatus.OK, result: false }),
    );

    await getFicpFcc.execute({
      uid: userId,
    });
    expect(mockBusSend).toHaveBeenNthCalledWith(1, FccFlagFalse);
  });

  it('should send event FicpFccCalculated. call api to get ficp flag failed', async () => {
    await profileGenerator.addSituation(userId, { ...situation, lead: true });
    ficpGatewaySpy.getRequestId = ficpGatewaySpy.getRequestId.mockImplementation(() =>
      Promise.resolve({ status: httpStatus.OK, result: 12345 }),
    );
    ficpGatewaySpy.getFlag = ficpGatewaySpy.getFlag.mockImplementation(() =>
      Promise.resolve({ status: httpStatus.INTERNAL_SERVER_ERROR, result: undefined }),
    );
    fccGatewaySpy.getRequestId = fccGatewaySpy.getRequestId.mockImplementation(() =>
      Promise.resolve({ status: httpStatus.OK, result: 12345 }),
    );
    fccGatewaySpy.getFlag = fccGatewaySpy.getFlag.mockImplementation(() =>
      Promise.resolve({ status: httpStatus.OK, result: false }),
    );
    await getFicpFcc.execute({
      uid: userId,
    });
    expect(mockBusSend).toHaveBeenNthCalledWith(1, FccFlagFalse);
  });

  it('should send event FicpFccCalculated. ficp flag equals true', async () => {
    ficpGatewaySpy.getRequestId = ficpGatewaySpy.getRequestId.mockImplementation(() =>
      Promise.resolve({ status: httpStatus.OK, result: 12345 }),
    );
    ficpGatewaySpy.getFlag = ficpGatewaySpy.getFlag.mockImplementation(() =>
      Promise.resolve({ status: httpStatus.OK, result: true }),
    );
    await getFicpFcc.execute({
      uid: userId,
    });
    expect(mockBusSend).toHaveBeenNthCalledWith(1, FicpFlagTrue);
  });

  it('should send event FicpFccCalculated. no lead', async () => {
    await profileGenerator.addSituation(userId, situation);
    ficpGatewaySpy.getRequestId = ficpGatewaySpy.getRequestId.mockImplementation(() =>
      Promise.resolve({ status: httpStatus.OK, result: 12345 }),
    );
    ficpGatewaySpy.getFlag = ficpGatewaySpy.getFlag.mockImplementation(() =>
      Promise.resolve({ status: httpStatus.OK, result: false }),
    );
    await getFicpFcc.execute({
      uid: userId,
    });
    expect(mockBusSend).toHaveBeenNthCalledWith(1, FicpFlagNoLead);
  });

  it('should send event FicpFccCalculated. call api to get fcc request id failed', async () => {
    await profileGenerator.addSituation(userId, { ...situation, lead: true });
    ficpGatewaySpy.getRequestId = ficpGatewaySpy.getRequestId.mockImplementation(() =>
      Promise.resolve({ status: httpStatus.OK, result: 12345 }),
    );
    ficpGatewaySpy.getFlag = ficpGatewaySpy.getFlag.mockImplementation(() =>
      Promise.resolve({ status: httpStatus.OK, result: false }),
    );
    fccGatewaySpy.getRequestId = fccGatewaySpy.getRequestId.mockImplementation(() =>
      Promise.resolve({ status: httpStatus.INTERNAL_SERVER_ERROR, result: undefined }),
    );
    await getFicpFcc.execute({
      uid: userId,
    });
    expect(mockBusSend).toHaveBeenNthCalledWith(1, CallFccFailed);
  });

  it('should send event FicpFccCalculated. call api to get fcc flag failed', async () => {
    await profileGenerator.addSituation(userId, { ...situation, lead: true });
    ficpGatewaySpy.getRequestId = ficpGatewaySpy.getRequestId.mockImplementation(() =>
      Promise.resolve({ status: httpStatus.OK, result: 12345 }),
    );
    ficpGatewaySpy.getFlag = ficpGatewaySpy.getFlag.mockImplementation(() =>
      Promise.resolve({ status: httpStatus.OK, result: false }),
    );
    fccGatewaySpy.getRequestId = fccGatewaySpy.getRequestId.mockImplementation(() =>
      Promise.resolve({ status: httpStatus.OK, result: 12345 }),
    );
    fccGatewaySpy.getFlag = fccGatewaySpy.getFlag.mockImplementation(() =>
      Promise.resolve({ status: httpStatus.INTERNAL_SERVER_ERROR, result: undefined }),
    );
    await getFicpFcc.execute({
      uid: userId,
    });
    expect(mockBusSend).toHaveBeenNthCalledWith(1, CallFccFailed);
  });

  it('should send event FicpFccCalculated. fcc flag equals false', async () => {
    await profileGenerator.addSituation(userId, { ...situation, lead: true });
    ficpGatewaySpy.getRequestId = ficpGatewaySpy.getRequestId.mockImplementation(() =>
      Promise.resolve({ status: httpStatus.OK, result: 12345 }),
    );
    ficpGatewaySpy.getFlag = ficpGatewaySpy.getFlag.mockImplementation(() =>
      Promise.resolve({ status: httpStatus.OK, result: false }),
    );
    fccGatewaySpy.getRequestId = fccGatewaySpy.getRequestId.mockImplementation(() =>
      Promise.resolve({ status: httpStatus.OK, result: 12345 }),
    );
    fccGatewaySpy.getFlag = fccGatewaySpy.getFlag.mockImplementation(() =>
      Promise.resolve({ status: httpStatus.OK, result: false }),
    );
    await getFicpFcc.execute({
      uid: userId,
    });
    expect(mockBusSend).toHaveBeenNthCalledWith(1, FccFlagFalse);
  });

  it('should send event FicpFccCalculated. fcc flag equals true', async () => {
    await profileGenerator.addSituation(userId, { ...situation, lead: true });
    ficpGatewaySpy.getRequestId = ficpGatewaySpy.getRequestId.mockImplementation(() =>
      Promise.resolve({ status: httpStatus.OK, result: 12345 }),
    );
    ficpGatewaySpy.getFlag = ficpGatewaySpy.getFlag.mockImplementation(() =>
      Promise.resolve({ status: httpStatus.OK, result: false }),
    );
    fccGatewaySpy.getRequestId = fccGatewaySpy.getRequestId.mockImplementation(() =>
      Promise.resolve({ status: httpStatus.OK, result: 12345 }),
    );
    fccGatewaySpy.getFlag = fccGatewaySpy.getFlag.mockImplementation(() =>
      Promise.resolve({ status: httpStatus.OK, result: true }),
    );
    await getFicpFcc.execute({
      uid: userId,
    });
    expect(mockBusSend).toHaveBeenNthCalledWith(1, FccFlagTrue);
  });
});
