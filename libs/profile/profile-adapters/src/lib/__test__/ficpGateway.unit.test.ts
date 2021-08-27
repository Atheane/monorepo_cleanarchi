import 'reflect-metadata';
import { buildProfileAdapterLib, ProfileGenerator } from '@oney/profile-adapters';
import { FicpGateway, Identifiers } from '@oney/profile-core';
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
import { OneyFicpMapper } from '../adapters/mappers/OneyFicpMapper';

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

describe('OneyFicpGateway unit test', () => {
  let mockBusSend: jest.Mock;
  let saveFixture: Function;
  let ficpGateway: FicpGateway;
  let ficpMapper: OneyFicpMapper;
  let profileGenerator: ProfileGenerator;
  const userId = 'AWzclPFyN';
  const ficpRequestId = 24424939;
  const partner_guid = 'e2d564e96a1b4bb5a8bef41c48a6bf88';

  beforeAll(async () => {
    mockBusSend = (ServiceBusClient.createFromConnectionString(null).createTopicClient(null).createSender()
      .send as unknown) as jest.Mock;
    config.forceAzureServiceBus = true;
    await buildProfileAdapterLib(container, config, identityConfig);

    ficpGateway = container.get(Identifiers.ficpGateway);
    ficpMapper = container.get(OneyFicpMapper);

    container.bind(ProfileGenerator).to(ProfileGenerator);
    profileGenerator = container.get(ProfileGenerator);
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/ficpGateway`);
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

  it('FicpGateway should get a ficp request id', async () => {
    const profile = await profileGenerator.afterContractStepSnapshot(userId);
    const fccResult = await ficpGateway.getRequestId(profile);
    expect(fccResult.status).toEqual(OK);
    expect(fccResult.result).toEqual(ficpRequestId);
  });

  it('FicpGateway should get a ficp request id error in call api', async () => {
    const profile = await profileGenerator.setFirstNameToNull(userId);
    const fccResult = await ficpGateway.getRequestId(profile);
    expect(fccResult.status).toEqual(INTERNAL_SERVER_ERROR);
    expect(fccResult.result).toBeUndefined();
  });

  it('FicpGateway should get a ficp flag', async () => {
    const fccResult = await ficpGateway.getFlag(ficpRequestId);
    expect(fccResult.status).toEqual(OK);
    expect(fccResult.result).toEqual(false);
  });

  it('FicpGateway should get a ficp flag error in call api', async () => {
    const wrongFicpRequestId = 123;
    const fccResult = await ficpGateway.getFlag(wrongFicpRequestId);
    expect(fccResult.status).toEqual(INTERNAL_SERVER_ERROR);
    expect(fccResult.result).toEqual(false);
  });

  it('OneyFicpMapper should map the profile to the ficp request id command when legalName is not null', async () => {
    const profile = await profileGenerator.afterContractStepSnapshot(userId);

    const getFicpRequestIdCommand = ficpMapper.fromDomain({
      profile,
      partner_guid,
    });

    expect(getFicpRequestIdCommand).toEqual(ficpRequestCommandMockWithMarriedName);
  });

  it('OneyFicpMapper should map the profile to the ficp request id command when legalName is null', async () => {
    const profile = await profileGenerator.afterContractStepSnapshot(userId);

    profile.props.informations.legalName = null;

    const getFicpRequestIdCommand = ficpMapper.fromDomain({
      profile,
      partner_guid,
    });

    expect(getFicpRequestIdCommand).toEqual(ficpRequestCommandMockWithoutMarriedName);
  });
});
