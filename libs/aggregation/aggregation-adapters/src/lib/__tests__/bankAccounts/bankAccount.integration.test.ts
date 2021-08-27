import { expect, it, describe, beforeAll, beforeEach } from '@jest/globals';
import * as mongoose from 'mongoose';
import * as nock from 'nock';
import {
  BankAccountError,
  BankAccountType,
  BankConnection,
  BankConnectionError,
  ConnectionStateEnum,
  User,
  UserError,
} from '@oney/aggregation-core';
import { EventProducerDispatcher } from '@oney/messages-core';
import * as path from 'path';
import { accountUsageNull } from './fixtures/accountUsageNull';
import { initMongooseConnection } from '../../adapters/services/MongoService';
import { AggregationKernel } from '../../di/AggregationKernel';
import { DomainDependencies } from '../../di/DomainDependencies';
import { testConfiguration } from '../config';
import { payloadSignIn, stateCase } from '../generate.fixtures';

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

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures`);

describe('Bank Account Integration testing', () => {
  let saveFixture: Function;
  let kernel: AggregationKernel;
  let dependencies: DomainDependencies;
  let user: User;
  let userId: string;
  const testIt: any = test;

  beforeAll(async () => {
    kernel = new AggregationKernel(testConfiguration);
    await kernel.initDependencies(false);
    dependencies = kernel.getDependencies();
    await initMongooseConnection(process.env.MONGO_URL);
  });
  beforeEach(async () => {
    nock.restore();
    nock.activate();
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures`);
    nock.back.setMode('record');
    const { nockDone } = await nock.back(testIt.getFixtureName());
    saveFixture = nockDone;
  });

  beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    const clearActions = [];
    for (const collection of collections) {
      clearActions.push(collection.deleteMany({}));
    }
    await Promise.all(clearActions);
    user = User.create({
      userId: 'azeazhgauipzeaz',
      consent: true,
    });
    userId = user.props.userId;
    await dependencies.userRepository.create(user.props);
  });

  afterEach(() => {
    const nockObjects = nock.recorder.play();
    if (nockObjects.length == 0) {
      nock.restore();
    } else {
      console.log('saving nock fixtures for: ', testIt.getFixtureName());
      saveFixture();
    }
  });

  it('Should get accounts for a bank connection', async () => {
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));
    const { bankAccounts } = await dependencies.getAccountsByConnectionId.execute({
      userId: bankConnection.props.userId,
      connectionId: bankConnection.props.connectionId,
    });
    expect(bankAccounts.map(account => account.props)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Compte chèque' }),
        expect.objectContaining({ currency: 'EUR' }),
      ]),
    );
    await dependencies.deleteBankConnection.execute({
      userId,
      connectionId: bankConnection.props.connectionId,
    });
  });

  it('Should aggregate one account', async () => {
    const eventDispatcherSpy = jest.spyOn(kernel.get(EventProducerDispatcher), 'dispatch');

    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));
    const { bankAccounts: accountsNotAggregated } = await dependencies.getAccountsByConnectionId.execute({
      userId: bankConnection.props.userId,
      connectionId: bankConnection.props.connectionId,
    });

    const formattedAccounts = accountsNotAggregated.map(account => ({
      id: account.props.id,
      name: account.props.name,
      aggregated: true,
    }));

    const aggregatedAccountsByConnection = await dependencies.aggregateAccounts.execute({
      userId: bankConnection.props.userId,
      connectionId: bankConnection.props.connectionId,
      accounts: [formattedAccounts[0]],
    });

    expect(aggregatedAccountsByConnection[0].id).toEqual(formattedAccounts[0].id);
    aggregatedAccountsByConnection.forEach(account => {
      expect(eventDispatcherSpy).toHaveBeenCalledWith(account);
    });
    await dependencies.deleteBankConnection.execute({
      userId,
      connectionId: bankConnection.props.connectionId,
    });
  });

  it('Should aggregate two accounts', async () => {
    const eventDispatcherSpy = jest.spyOn(kernel.get(EventProducerDispatcher), 'dispatch');

    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));
    const { bankAccounts: accountsNotAggregated } = await dependencies.getAccountsByConnectionId.execute({
      userId: bankConnection.props.userId,
      connectionId: bankConnection.props.connectionId,
    });

    const formattedAccounts = accountsNotAggregated.map(account => ({
      id: account.props.id,
      name: account.props.name,
      aggregated: true,
    }));

    const aggregatedAccountsByConnection = await dependencies.aggregateAccounts.execute({
      userId: bankConnection.props.userId,
      connectionId: bankConnection.props.connectionId,
      accounts: formattedAccounts,
    });

    expect(aggregatedAccountsByConnection[0].id).toEqual(formattedAccounts[0].id);
    aggregatedAccountsByConnection.forEach(account => {
      expect(eventDispatcherSpy).toHaveBeenCalledWith(account);
    });
    await dependencies.deleteBankConnection.execute({
      userId,
      connectionId: bankConnection.props.connectionId,
    });
  });

  it('Should disaggregate two accounts', async () => {
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));
    const { bankAccounts: accountsNotAggregated } = await dependencies.getAccountsByConnectionId.execute({
      userId,
      connectionId: bankConnection.props.connectionId,
    });

    const formattedAccounts = accountsNotAggregated.map(account => ({
      id: account.props.id,
      name: account.props.name,
      aggregated: true,
    }));
    const aggregatedAccountsByConnection = await dependencies.aggregateAccounts.execute({
      userId: bankConnection.props.userId,
      connectionId: bankConnection.props.connectionId,
      accounts: formattedAccounts,
    });

    await dependencies.bankAccountGateway.disaggregateAccounts(aggregatedAccountsByConnection);
    const { bankAccounts } = await dependencies.getAllBankAccounts.execute({
      userId: bankConnection.props.userId,
    });
    expect(bankAccounts).toEqual([]);
  });

  it('Should throw a bank account not found error if fakeaccount', async () => {
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));
    const result = dependencies.aggregateAccounts.execute({
      connectionId: bankConnection.props.connectionId,
      accounts: [
        {
          id: 'aezaze',
          name: 'aze',
          aggregated: true,
        },
      ],
      userId,
    });

    await expect(result).rejects.toThrow(BankAccountError.BankAccountNotFound);
    await dependencies.deleteBankConnection.execute({
      userId,
      connectionId: bankConnection.props.connectionId,
    });
  });

  it('Should throw a bank connection not found error', async () => {
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));
    const { bankAccounts: accounts } = await dependencies.getAccountsByConnectionId.execute({
      userId,
      connectionId: bankConnection.props.connectionId,
    });

    const result = dependencies.aggregateAccounts.execute({
      connectionId: 'zaeazeazeaze',
      accounts: [
        {
          id: accounts[0].props.id.toString(),
          name: accounts[0].props.name,
          aggregated: true,
        },
      ],
      userId,
    });

    await expect(result).rejects.toThrow(BankConnectionError.BankConnectionNotFound);
    await dependencies.deleteBankConnection.execute({
      userId,
      connectionId: bankConnection.props.connectionId,
    });
  });

  it('should throw a FieldValidationFailure if no account is provided', async () => {
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));
    const result = dependencies.aggregateAccounts.execute({
      connectionId: bankConnection.props.connectionId,
      accounts: [],
      userId: bankConnection.props.userId,
    });

    await expect(result).rejects.toThrow(BankAccountError.FieldValidationFailure);
    await dependencies.deleteBankConnection.execute({
      userId,
      connectionId: bankConnection.props.connectionId,
    });
  });

  it('should throw a FieldValidationFailure if id is missing', async () => {
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));
    const { bankAccounts: accounts } = await dependencies.getAccountsByConnectionId.execute({
      userId,
      connectionId: bankConnection.props.connectionId,
    });

    const result = dependencies.aggregateAccounts.execute({
      connectionId: bankConnection.props.connectionId,
      accounts: [
        {
          id: undefined,
          name: accounts[0].props.name,
          aggregated: true,
        },
      ],
      userId,
    });

    await expect(result).rejects.toThrow(BankAccountError.FieldValidationFailure);
    await dependencies.deleteBankConnection.execute({
      userId,
      connectionId: bankConnection.props.connectionId,
    });
  });

  it('should throw a FieldValidationFailure if aggregated is missing', async () => {
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));
    const { bankAccounts: accounts } = await dependencies.getAccountsByConnectionId.execute({
      userId,
      connectionId: bankConnection.props.connectionId,
    });

    const result = dependencies.aggregateAccounts.execute({
      connectionId: bankConnection.props.connectionId,
      accounts: [
        {
          id: accounts[0].props.id.toString(),
          name: accounts[0].props.name,
          aggregated: undefined,
        },
      ],
      userId,
    });
    await expect(result).rejects.toThrow(BankAccountError.FieldValidationFailure);
    await dependencies.deleteBankConnection.execute({
      userId,
      connectionId: bankConnection.props.connectionId,
    });
  });

  it('Should get an empty list of accounts if no accounts were aggregated', async () => {
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));
    const { bankAccounts: aggregatedAccounts } = await dependencies.getAllBankAccounts.execute({
      userId,
    });
    expect(aggregatedAccounts).toEqual([]);
    await dependencies.deleteBankConnection.execute({
      userId,
      connectionId: bankConnection.props.connectionId,
    });
  });

  it('Should get an empty list of accounts for an unresolved otp', async () => {
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.OTP));
    const { bankAccounts: aggregatedAccounts } = await dependencies.getAllBankAccounts.execute({
      userId,
    });
    expect(aggregatedAccounts).toEqual([]);
    await dependencies.deleteBankConnection.execute({
      userId,
      connectionId: bankConnection.props.connectionId,
    });
  });

  it('should not filter out account with account_usage === null', async () => {
    await dependencies.bankConnectionRepository.save(
      new BankConnection({
        userId: 'userId',
        connectionId: 'connectionId',
        bankId: 'bankId',
        refId: '1212',
        connectionDate: new Date(),
        active: true,
        state: ConnectionStateEnum.VALID,
      }).props,
    );
    const accounts = await dependencies.biBankAccountGateway.filterBankAccounts([accountUsageNull]);
    expect(accounts[0].props).toEqual(
      expect.objectContaining({
        aggregated: false,
        balance: 2202.79,
        currency: 'EUR',
        establishment: {
          name: null,
        },
        bankId: 'bankId',
        id: '203',
        userId: 'userId',
        metadatas: {
          iban: 'iban',
        },
        name: 'name',
        number: 'number',
        type: BankAccountType.JOINT,
        ownership: undefined,
      }),
    );
  });

  it('should throw a UserUnknown error', async () => {
    const result = dependencies.getAllBankAccounts.execute({
      userId: 'unknown',
    });
    await expect(result).rejects.toThrow(UserError.UserUnknown);
  });

  it('should map only joint, card and checking account type', async () => {
    const result = dependencies.mappers.budgetInsightBankAccountTypeMapper.toDomain('unknown');
    expect(result).toBeUndefined();
  });

  it('should bankAccount OWner identity', async () => {
    const result = dependencies.mappers.ownerIdentityMapper.toDomain({
      owner: {
        name: 'Monsieur Honoré Emile',
        birth_date: '06-10-1984',
      },
    });
    expect(result).toEqual({
      identity: 'Monsieur Honoré Emile',
      birthDate: new Date('06-10-1984').toLocaleDateString(),
    });
  });

  it('should delete bank accounts', async () => {
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));
    const { bankAccounts: accountsNotAggregated } = await dependencies.getAccountsByConnectionId.execute({
      userId: bankConnection.props.userId,
      connectionId: bankConnection.props.connectionId,
    });
    const formattedAccounts = accountsNotAggregated.map(account => ({
      id: account.props.id,
      name: account.props.name,
      aggregated: true,
    }));
    await dependencies.aggregateAccounts.execute({
      userId: bankConnection.props.userId,
      connectionId: bankConnection.props.connectionId,
      accounts: formattedAccounts,
    });
    await dependencies.deleteBankConnection.execute({
      userId,
      connectionId: bankConnection.props.connectionId,
    });
    const noBankAccountsFetched = await dependencies.bankAccountRepository.filterBy({ aggregated: true });
    expect(noBankAccountsFetched).toEqual([]);
  });

  it('should save bankAccount from connections', async () => {
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));
    const { bankAccounts: accountsNotAggregated } = await dependencies.getAccountsByConnectionId.execute({
      userId,
      connectionId: bankConnection.props.connectionId,
    });

    const formattedAccounts = accountsNotAggregated.map(account => ({
      id: account.props.id,
      name: account.props.name,
      aggregated: true,
    }));

    await dependencies.aggregateAccounts.execute({
      userId: bankConnection.props.userId,
      connectionId: bankConnection.props.connectionId,
      accounts: formattedAccounts,
    });

    // Delete all bankAccounts
    const aggregatedAccounts = await dependencies.bankAccountRepository.filterBy({ userId });
    await Promise.all(
      aggregatedAccounts.map(account => dependencies.bankAccountRepository.deleteOne(account.props.id)),
    );

    const { bankAccounts } = await dependencies.getAllBankAccounts.execute({
      userId: bankConnection.props.userId,
    });

    // Check if bankAccounts are returned
    expect(bankAccounts[0].id).toEqual(formattedAccounts[0].id);
    expect(bankAccounts[1].id).toEqual(formattedAccounts[1].id);

    // Check if bankAccounts are saved
    const savedBankAccounts = await dependencies.bankAccountRepository.filterBy({ userId });
    expect(savedBankAccounts).not.toEqual([]);
  });
});
