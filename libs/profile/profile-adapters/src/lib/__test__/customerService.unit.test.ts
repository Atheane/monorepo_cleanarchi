import 'reflect-metadata';
import { Container } from 'inversify';
import { buildProfileAdapterLib } from '@oney/profile-adapters';
import { GetCustomerServiceTopics, SendDemandToCustomerService, DocumentErrors } from '@oney/profile-core';
import { ServiceBusClient } from '@azure/service-bus';
import * as nock from 'nock';
import MockDate from 'mockdate';
import * as path from 'path';
import { event } from './fixtures/customerService/events';
import { config, identityConfig } from './fixtures/config';

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures/customerService`);
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

describe('Test suite for Customer Service Demands from user', () => {
  let mockBusSend: jest.Mock;
  const userId = 'MnDqtMQrm';

  beforeAll(async () => {
    config.forceAzureServiceBus = true;
    await buildProfileAdapterLib(container, config, identityConfig);
    mockBusSend = (ServiceBusClient.createFromConnectionString(null).createTopicClient(null).createSender()
      .send as unknown) as jest.Mock;
    nock.enableNetConnect();
  });

  beforeEach(() => {
    mockBusSend.mockClear();
  });

  afterEach(() => {
    MockDate.reset();
  });

  afterAll(async () => {
    nock.disableNetConnect();
  });

  it('Should dispatch CUSTOMER_SERVICE_DEMAND_SENT', async () => {
    MockDate.set(new Date('2021-02-18T00:00:00.000Z'));
    await container.get(SendDemandToCustomerService).execute({
      firstname: 'Mando',
      lastname: 'Lorian',
      birthname: 'Din Djarin',
      email: 'mando.lorian@gmail.com',
      phone: '0707070708',
      gender: 'M',
      userId,
      topic: 'Ma carte',
      demand: "J'ai perdu ma carte, comment puis-je en commander une nouvelle",
    });
    expect(mockBusSend).toHaveBeenCalledWith(event);
  });

  it('should get customer service default topics from blob', async () => {
    const { nockDone } = await nockBack('customer-service-topics.json');

    const result = await container.get(GetCustomerServiceTopics).execute({});
    expect(JSON.parse(result.toString())).toEqual({
      ACCOUNT_CREATION: 'Ma demande de création de compte',
      ACCOUNT: 'Mon compte',
      TRANSACTIONS: 'Mes transactions',
      CARD: 'Ma carte',
      PROFILE: 'Mon profil',
      APP: 'Mon application',
      CLAIM: "J'ai une réclamation",
      IDEA: "J'ai une idée pour vous",
      BACK_OFF: 'Je souhaite me rétracter',
      CLOSE_ACCOUNT: 'Je souhaite fermer mon compte Oney+',
    });
    nockDone();
  });

  it('should throw document not found', async () => {
    const { nockDone } = await nockBack('document-not-found.json');

    const result = container.get(GetCustomerServiceTopics).execute({ versionNumber: 'fake_version_number' });
    await expect(result).rejects.toThrow(DocumentErrors.DocumentNotFound);
    nockDone();
  });
});
