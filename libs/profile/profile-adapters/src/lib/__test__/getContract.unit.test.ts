import { buildProfileAdapterLib, ProfileGenerator } from '@oney/profile-adapters';
import { GetContract } from '@oney/profile-core';
import { Container } from 'inversify';
import { jest } from '@jest/globals';
import * as nock from 'nock';
import { DocumentGenerator } from '@oney/document-generator';
import { ProfileStatus } from '@oney/profile-messages';
import * as path from 'path';
import * as fs from 'fs';
import { config, identityConfig } from './fixtures/config';

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

describe('Test suite for Get Contract', () => {
  let getContract: GetContract;
  let userId: string;
  let profileGenerator: ProfileGenerator;

  let spyDocumentGeneratorGetData;
  let spyDocumentGeneratorGenerate;

  beforeAll(async () => {
    userId = 'AWzclPFyN';
    config.forceAzureServiceBus = true;
    await buildProfileAdapterLib(container, config, identityConfig);
    getContract = container.get(GetContract);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    profileGenerator = container.get(ProfileGenerator);

    spyDocumentGeneratorGenerate = jest
      .spyOn(DocumentGenerator.prototype, 'generate')
      .mockImplementation(() => Promise.resolve(new DocumentGenerator('', true)));

    const file = path.resolve(__dirname, 'fixtures/getContract/contract.fixtures.pdf');
    spyDocumentGeneratorGetData = jest
      .spyOn(DocumentGenerator.prototype, 'getData', 'get')
      .mockImplementation(async () => await fs.readFileSync(file));
    nock.disableNetConnect();
  });

  beforeEach(() => {
    spyDocumentGeneratorGetData.mockClear();
    spyDocumentGeneratorGenerate.mockClear();
    nock.cleanAll();
  });

  it('Should get a non signed contract', async () => {
    const file = path.resolve(__dirname, 'fixtures/getContract/contract.fixtures.pdf');

    await profileGenerator.generate(userId, ProfileStatus.ON_BOARDING);
    const result = await getContract.execute({
      uid: userId,
    });
    expect(result).toBeInstanceOf(Buffer);
    expect(result.includes(fs.readFileSync(file))).toBe(true);
  });

  it('Should get a signed contract', async () => {
    await profileGenerator.afterContractStepSnapshot(userId);

    const file = path.resolve(__dirname, 'fixtures/getContract/contract.fixtures.pdf');

    const nockFile = nock('https://odb0storage0dev.blob.core.windows.net')
      .persist()
      .get(`/documents/${userId}%2Fcontract%2Fcontract.pdf`)
      .replyWithFile(200, file, {
        'Content-Type': 'application/pdf',
        'Content-Length': '14610',
        eTag: '123',
      });

    const result = await getContract.execute({
      uid: userId,
    });
    expect(result).toBeInstanceOf(Buffer);
    expect(result.includes(fs.readFileSync(file))).toBe(true);
    nockFile.done();
  });
});
