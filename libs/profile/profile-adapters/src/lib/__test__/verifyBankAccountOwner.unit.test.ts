import 'reflect-metadata';
import { BankAccountOwnerCommand, ProfileErrors, VerifyBankAccountOwner } from '@oney/profile-core';
import { Container } from 'inversify';
import * as nock from 'nock';
import { ShortIdGenerator } from '@oney/profile-adapters';
import { ProfileStatus } from '@oney/profile-messages';
import * as path from 'path';
import { config, identityConfig } from './fixtures/config';
import { ProfileGenerator } from './fixtures/tips/ProfileGenerator';
import { buildProfileAdapterLib } from '../adapters/build';

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

jest.spyOn(ShortIdGenerator.prototype, 'generateUniqueID').mockImplementation(() => 'uniqueIdUnitTest');
jest.spyOn(Date.prototype, 'getFullYear').mockImplementation(() => 1990);
jest.spyOn(Date.prototype, 'getMonth').mockImplementation(() => 1);
jest.spyOn(Date.prototype, 'getDate').mockImplementation(() => 4);

describe('Test suite to Verify Bank Account Owner', () => {
  let verifyBankAccountOwner: VerifyBankAccountOwner;
  let saveFixture: Function;
  let userId: string;
  let tipsDb: ProfileGenerator;

  beforeAll(async () => {
    userId = 'AWzclPFyN';
    config.forceAzureServiceBus = true;
    await buildProfileAdapterLib(container, config, identityConfig);
    verifyBankAccountOwner = container.get(VerifyBankAccountOwner);
    container.bind(ProfileGenerator).to(ProfileGenerator);
    tipsDb = container.get(ProfileGenerator);
    await tipsDb.generate(userId, ProfileStatus.ACTIVE, 'TEST_ONEY_TEAM_PROFILE_2602_1828');
  });

  beforeEach(async () => {
    nock.restore();
    nock.activate();
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures/verifyBankAccountOwner`);
    nock.back.setMode('record');
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

  it('Should return true when verifying bank account owner with all data', async () => {
    const result = await verifyBankAccountOwner.execute({
      uid: userId,
      identity: 'Mazendk Mazen',
      lastName: 'Mazen',
      firstName: 'Mazendk',
      birthDate: '1990-01-01',
      bankName: 'Boursorama',
    });
    expect(result).toBeTruthy();
  });

  it('Should return true when verifying bank account owner with only identity', async () => {
    tipsDb.getProfileFemale(userId);
    const result = await verifyBankAccountOwner.execute({
      uid: userId,
      identity: 'Mazendk Mazen',
      birthDate: '1990-01-01',
      bankName: 'Boursorama',
    });
    expect(result).toBeTruthy();
  });

  it('Should return false when verifying bank account owner and Oneytrust returns MISMATCH', async () => {
    const result = await verifyBankAccountOwner.execute({
      uid: userId,
      identity: 'MLE TOTO TATA',
      lastName: 'TOTO',
      firstName: 'TATA',
      birthDate: '1989-09-28',
      bankName: 'Boursorama',
    });
    expect(result).toBeFalsy();
  });

  it('Should return false when verifying bank account owner and Oneytrust returns MISSING_DATA', async () => {
    const result = await verifyBankAccountOwner.execute({
      uid: userId,
      identity: 'MLE TOTO TATA',
      lastName: 'TOTO',
      firstName: 'TATA',
      birthDate: '1989-09-28',
      bankName: 'Boursorama',
    });
    expect(result).toBeFalsy();
  });

  it('Should throw if missing identity data', async () => {
    const result = verifyBankAccountOwner.execute({
      uid: userId,
    } as BankAccountOwnerCommand);
    await expect(result).rejects.toThrowError(
      new ProfileErrors.BankAccountIdentityError('Missing identity information'),
    );
  });
});
