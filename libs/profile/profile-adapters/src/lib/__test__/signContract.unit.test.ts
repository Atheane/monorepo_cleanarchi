import 'reflect-metadata';
import { buildProfileAdapterLib, ProfileGenerator } from '@oney/profile-adapters';
import { SignContract, Steps, ContractErrors } from '@oney/profile-core';
import { Container } from 'inversify';
import * as nock from 'nock';
import MockDate from 'mockdate';
import { ServiceBusClient } from '@azure/service-bus';
import { DocumentGenerator } from '@oney/document-generator';
import { ProfileStatus } from '@oney/profile-messages';
import { config, identityConfig } from './fixtures/config';
import {
  domainEventContractSigned,
  domainEventProfileStatusChanged,
  legacyEvent,
} from './fixtures/contract/events';

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

jest.mock('jsonwebtoken', () => ({
  sign: jest
    .fn()
    .mockReturnValue(
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjE1MTIwNDgzLWE4ZjgtNDViMS05N2JiLWU0ZGQ4NzZiNTlhMCJ9.eyJmbG93c3RlcHMiOlsiU0NBX0lOQVBQIl0sImNsaWVudF9pZCI6IlBUQUlMX0JRX0RJR0lUIiwiaWRlbnRpZmllcnMiOlt7ImlkIjoiTkdGT0hGeDhVc3JybldtbllDZWJRYjdxcXNFQjNaVWdfNkNMUzNFTVZIUGFNUDFhIiwidHlwZSI6IkZQIn1dLCJpYXQiOjE2MTEyNTI4MTYsImV4cCI6MTYxMzg0NDgxNiwiaXNzIjoiT0RCIiwic3ViIjoiaW5vaWQxMDAzODc1NzE2In0.H0hlicswSpQ1-xUkirCE-ZQ-ymk5ec0Kh8BZhCUf0zDW-pd0n1lw2kzbehkHFHDt3EHjWQauaXuz6sqK_q7qfzbeuN0kElI4xHQ3FKA-pkfHlrbSWRjmN5xDFBMGfuao_Aroc8YvIKMt98YZvkJZ1Tmxazi27U_KwoC4uvAjKKI',
    ),
}));

const container = new Container();

describe('Test suite for Sign Contract step', () => {
  let mockBusSend: jest.Mock;
  let signContractStep: SignContract;
  let spyDocumentGeneratorSave: jest.SpyInstance;
  let spyDocumentGeneratorGenerate: jest.SpyInstance;
  let profiledb: ProfileGenerator;
  let userId: string;

  beforeAll(async () => {
    mockBusSend = (ServiceBusClient.createFromConnectionString(null).createTopicClient(null).createSender()
      .send as unknown) as jest.Mock;
    userId = 'AWzclPFyN';
    spyDocumentGeneratorGenerate = jest
      .spyOn(DocumentGenerator.prototype, 'generate')
      .mockImplementation(() => Promise.resolve(new DocumentGenerator('', true)));
    spyDocumentGeneratorSave = jest
      .spyOn(DocumentGenerator.prototype, 'save')
      .mockImplementation(() => Promise.resolve(true));
    config.forceAzureServiceBus = true;
    await buildProfileAdapterLib(container, config, identityConfig);
    signContractStep = container.get(SignContract);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    profiledb = container.get(ProfileGenerator);
    await profiledb.generate(userId, ProfileStatus.ON_BOARDING);
  });

  beforeEach(() => {
    MockDate.set(new Date('2021-02-18T00:00:00.000Z'));
    mockBusSend.mockClear();
    nock.cleanAll();
    spyDocumentGeneratorSave.mockClear();
    spyDocumentGeneratorGenerate.mockClear();
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('Should complete Sign Contract step', async () => {
    const result = await signContractStep.execute({
      uid: userId,
      date: new Date(),
    });
    expect(result.props.kyc.steps.includes(Steps.CONTRACT_STEP)).toBeFalsy();
    expect(result.props.kyc.contractSignedAt).toBeDefined();
    expect(mockBusSend).toHaveBeenNthCalledWith(1, domainEventContractSigned);
    expect(mockBusSend).toHaveBeenNthCalledWith(2, domainEventProfileStatusChanged);
    expect(mockBusSend).toHaveBeenNthCalledWith(3, legacyEvent);
  });

  it('Should throw ContractSigned', async () => {
    await profiledb.generate(userId, ProfileStatus.ON_BOARDING);
    await profiledb.addStepContract(userId);
    await signContractStep.execute({
      uid: userId,
      date: new Date(),
    });
    const result = signContractStep.execute({
      uid: userId,
      date: new Date(),
    });
    await expect(result).rejects.toThrow(ContractErrors.ContractSigned);
  });
});
