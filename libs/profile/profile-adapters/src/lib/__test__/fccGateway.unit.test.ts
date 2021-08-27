import 'reflect-metadata';
import { buildProfileAdapterLib, ProfileGenerator } from '@oney/profile-adapters';
import { FccGateway, Identifiers } from '@oney/profile-core';
import { Container } from 'inversify';
import * as nock from 'nock';
import { ServiceBusClient } from '@azure/service-bus';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import * as path from 'path';
import { config, identityConfig } from './fixtures/config';
import {
  ficpRequestCommandMockWithMarriedName,
  ficpRequestCommandMockWithoutMarriedName,
} from './fixtures/ficpGateway/FicpRequestCommandMock';
import { OneyFccMapper } from '../adapters/mappers/OneyFccMapper';

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
const container = new Container();

describe('OneyFccGateway unit test', () => {
  let mockBusSend: jest.Mock;
  let saveFixture: Function;
  let fccGateway: FccGateway;
  let fccMapper: OneyFccMapper;
  let profileGenerator: ProfileGenerator;
  const userId = 'AWzclPFyN';
  const fccRequestId = 24424921;
  const partner_guid = 'e2d564e96a1b4bb5a8bef41c48a6bf88';

  beforeAll(async () => {
    mockBusSend = (ServiceBusClient.createFromConnectionString(null).createTopicClient(null).createSender()
      .send as unknown) as jest.Mock;
    config.forceAzureServiceBus = true;
    await buildProfileAdapterLib(container, config, identityConfig);

    fccGateway = container.get(Identifiers.fccGateway);
    fccMapper = container.get(OneyFccMapper);

    container.bind(ProfileGenerator).to(ProfileGenerator);
    profileGenerator = container.get(ProfileGenerator);
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/fccGateway`);
    nock.back.setMode('record');
  });

  beforeEach(async () => {
    mockBusSend.mockClear();
    nock.restore();
    nock.activate();
    const { nockDone } = await nock.back(test.getFixtureName());
    saveFixture = nockDone;
  });

  afterEach(() => {
    const nockObjects = nock.recorder.play();
    if (nockObjects.length > 0) {
      saveFixture();
    }
  });

  it('FccGateway should get a fcc request id', async () => {
    const profile = await profileGenerator.afterContractStepSnapshot(userId);
    const getRequestIdResult = await fccGateway.getRequestId(profile);
    expect(getRequestIdResult.status).toEqual(OK);
    expect(getRequestIdResult.result).toEqual(fccRequestId);
  });

  it('FccGateway should get a fcc request id error in call api', async () => {
    const profile = await profileGenerator.setFirstNameToNull(userId);
    const getRequestIdResult = await fccGateway.getRequestId(profile);
    expect(getRequestIdResult.status).toEqual(INTERNAL_SERVER_ERROR);
    expect(getRequestIdResult.result).toBeUndefined();
  });

  it('FccGateway should get a fcc flag', async () => {
    const fccResult = await fccGateway.getFlag(fccRequestId);
    expect(fccResult.status).toEqual(OK);
    expect(fccResult.result).toEqual(false);
  });

  it('FccGateway should get a fcc flag error in call api', async () => {
    const wrongFccRequestId = 123;
    const fccResult = await fccGateway.getFlag(wrongFccRequestId);
    expect(fccResult.status).toEqual(INTERNAL_SERVER_ERROR);
    expect(fccResult.result).toBeUndefined();
  });

  it('OneyFccMapper should map the profile to the fcc request id command when legalName is not null', async () => {
    const profile = await profileGenerator.afterContractStepSnapshot(userId);

    const getFccRequestIdCommand = fccMapper.fromDomain({
      profile,
      partner_guid,
    });

    expect(getFccRequestIdCommand).toEqual(ficpRequestCommandMockWithMarriedName);
  });

  it('OneyFccMapper should map the profile to the fcc request id command when legalName is null', async () => {
    const profile = await profileGenerator.afterContractStepSnapshot(userId);

    profile.props.informations.legalName = null;

    const getFccRequestIdCommand = fccMapper.fromDomain({
      profile,
      partner_guid,
    });

    expect(getFccRequestIdCommand).toEqual(ficpRequestCommandMockWithoutMarriedName);
  });
});
