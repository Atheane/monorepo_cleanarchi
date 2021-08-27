import { TransactionType } from '@oney/common-core';
import { BankAccountError, BankAccountType, CreditDecisioningError, User } from '@oney/aggregation-core';
import { AccountType as AlgoanAccountType, TransactionType as AlgoanTransactionType } from '@oney/algoan';
import * as dateMock from 'jest-date-mock';
import * as nock from 'nock';
import * as path from 'path';
import { biTransactions } from './fixtures/biTransactions';
import { ALL_USERS } from './fixtures/data';
import { AggregationKernel } from '../../di/AggregationKernel';
import { DomainDependencies } from '../../di/DomainDependencies';
import { testConfiguration } from '../config';
import { createUser, payloadSignIn, stateCase, aggregateAccounts } from '../generate.fixtures';

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

describe('PP2reve unit testing', () => {
  let dependencies: DomainDependencies;
  let kernel: AggregationKernel;
  let saveFixture: Function;
  const userId = 'K-oZktdWv';
  const testIt: any = test;

  beforeAll(async () => {
    kernel = new AggregationKernel(testConfiguration);
    await kernel.initDependencies(true);
    dependencies = kernel.getDependencies();
    nock.back.fixtures = path.resolve(`${__dirname}/fixtures`);
    nock.back.setMode('record');
    dateMock.advanceTo(new Date('2020-05-21T00:00:00.000Z'));
    // when defining new fixtures, please uncomment line below
    // jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });

  beforeEach(async () => {
    nock.restore();
    nock.activate();
    const { nockDone } = await nock.back(testIt.getFixtureName());
    saveFixture = nockDone;
  });

  afterEach(async () => {
    const nockObjects = nock.recorder.play();
    if (nockObjects.length == 0) {
      nock.restore();
    } else {
      console.log('saving nock fixture for: ', testIt.getFixtureName());
      saveFixture();
    }
  });

  afterAll(() => {
    nock.cleanAll();
  });

  it('Should get transactions for a bank connection', async () => {
    await createUser(kernel, userId);
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));
    await aggregateAccounts(kernel, userId, bankConnection);

    const { bankAccounts } = await dependencies.getTransactionsByConnectionId.execute({
      userId,
      connectionId: bankConnection.props.connectionId,
    });
    expect(bankAccounts.map(account => account.props)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ownerIdentity: { identity: 'Monsieur Honoré Émile' },
          transactions: expect.arrayContaining([
            expect.objectContaining({
              props: expect.objectContaining({
                type: 'ATM',
                label: 'RETRAIT DAB LA BANQUE POSTALE',
              }),
            }),
          ]),
        }),
      ]),
    );
    await dependencies.deleteBankConnection.execute({
      connectionId: bankConnection.props.connectionId,
      userId,
    });
    await dependencies.deleteUser.execute({ userId });
  });

  it('Should get all transactions for a user', async () => {
    await createUser(kernel, userId);
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));
    await aggregateAccounts(kernel, userId, bankConnection);

    const { bankAccounts } = await dependencies.getAllTransactions.execute({
      userId: bankConnection.props.userId,
    });
    expect(bankAccounts.map(account => account.props)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ownerIdentity: { identity: 'Monsieur Honoré Émile' },
          transactions: expect.arrayContaining([
            expect.objectContaining({
              props: expect.objectContaining({
                type: 'ATM',
                label: 'RETRAIT DAB LA BANQUE POSTALE',
              }),
            }),
          ]),
        }),
      ]),
    );
    await dependencies.deleteBankConnection.execute({
      connectionId: bankConnection.props.connectionId,
      userId,
    });
    await dependencies.deleteUser.execute({ userId });
  });

  it('should post transactions to algoan', async () => {
    await createUser(kernel, userId);
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));
    await aggregateAccounts(kernel, userId, bankConnection);

    const user = await dependencies.userRepository.findBy({ userId });
    expect(user.props.creditDecisioningUserId).toBeUndefined();
    const userWithTransactionsPostedToAlgoan = await dependencies.postAllTransactions.execute({
      userId,
    });
    expect(userWithTransactionsPostedToAlgoan.props.creditDecisioningUserId).toBeTruthy();

    expect(userWithTransactionsPostedToAlgoan.props.unsavedTransactions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          props: expect.objectContaining({
            label: '',
            type: 'CARD',
          }),
        }),
      ]),
    );
    await dependencies.deleteBankConnection.execute({
      connectionId: bankConnection.props.connectionId,
      userId,
    });
    await dependencies.deleteUser.execute({ userId });
  });

  it('should retrieve categorized transactions', async () => {
    const userId = 'kTDhDRrHv';
    await createUser(kernel, userId);
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));
    await aggregateAccounts(kernel, userId, bankConnection);

    await dependencies.postAllTransactions.execute({
      userId,
    });

    const categorizedTransactions = await dependencies.getCategorizedTransactions.execute({
      userId,
    });

    expect(categorizedTransactions.map(t => t.props)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: 'VIREMENT SALAIRE',
          type: 'TRANSFER',
          category: 'WAGE',
        }),
      ]),
    );

    await dependencies.deleteBankConnection.execute({
      userId,
      connectionId: bankConnection.props.connectionId,
    });
    await dependencies.deleteUser.execute({ userId });
  });

  it('should return creditProfile', async () => {
    const userId = 'azeniuagozuigi';
    await createUser(kernel, userId);
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));
    await aggregateAccounts(kernel, userId, bankConnection);

    await dependencies.postAllTransactions.execute({
      userId,
    });

    const creditProfile = await dependencies.getUserCreditProfile.execute({
      userId,
    });
    expect(creditProfile.creditScoring).toEqual({
      rate: 944,
      indicators: { savings: 1, lifestyle: 2, cash: 2 },
    });
  });

  it('should return null creditProfile', async () => {
    const userId = 'azeazjhgloiuh';
    await createUser(kernel, userId);
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));
    await aggregateAccounts(kernel, userId, bankConnection);

    await dependencies.postAllTransactions.execute({
      userId,
    });

    const creditProfile = await dependencies.getUserCreditProfile.execute({
      userId,
    });
    expect(creditProfile).toBeNull();
    await dependencies.deleteBankConnection.execute({
      userId,
      connectionId: bankConnection.props.connectionId,
    });
    await dependencies.deleteUser.execute({ userId });
  });

  it('should throw CreditDecisioningError.UserUnknown', async () => {
    const userId = 'userUnknown';
    await createUser(kernel, userId);

    const result = dependencies.getUserCreditProfile.execute({
      userId,
    });
    await expect(result).rejects.toThrow(CreditDecisioningError.UserUnknown);
  });

  it('Should throw NoAggregatedAccounts error when getTransactionsByConnectionId', async () => {
    const userId = 'azjeguyazg1';
    await createUser(kernel, userId);
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));
    const transactions = dependencies.getTransactionsByConnectionId.execute({
      userId,
      connectionId: bankConnection.props.connectionId,
    });
    await expect(transactions).rejects.toThrow(BankAccountError.NoAggregatedAccounts);
    await dependencies.deleteBankConnection.execute({
      connectionId: bankConnection.props.connectionId,
      userId,
    });
    await dependencies.deleteUser.execute({ userId });
  });

  it('Should throw NoAggregatedAccounts error when getAllTransactions', async () => {
    const userId = 'azjeguyazg2';
    await createUser(kernel, userId);
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));
    const transactions = dependencies.getAllTransactions.execute({
      userId,
    });

    await expect(transactions).rejects.toThrow(BankAccountError.NoAggregatedAccounts);
    await dependencies.deleteBankConnection.execute({
      connectionId: bankConnection.props.connectionId,
      userId,
    });
    await dependencies.deleteUser.execute({ userId });
  });

  it('Should throw NoAggregatedAccounts error when postAllTransactions', async () => {
    const userId = 'azjeguyazg3';
    await createUser(kernel, userId);
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));
    const transactions = dependencies.postAllTransactions.execute({
      userId,
    });
    await expect(transactions).rejects.toThrow(BankAccountError.NoAggregatedAccounts);
    await dependencies.deleteBankConnection.execute({
      connectionId: bankConnection.props.connectionId,
      userId,
    });
    await dependencies.deleteUser.execute({ userId });
  });

  it('should map bank account types', async () => {
    const result1 = dependencies.mappers.algoanBankAccountTypeMapper.toDomain('LOAN');
    expect(result1).toBeUndefined();
    const result2 = dependencies.mappers.algoanBankAccountTypeMapper.toDomain(AlgoanAccountType.CREDIT_CARD);
    expect(result2).toEqual(BankAccountType.CARD);
    const result3 = dependencies.mappers.algoanBankAccountTypeMapper.fromDomain(BankAccountType.JOINT);
    expect(result3).toEqual(AlgoanAccountType.CHECKINGS);
    const result4 = dependencies.mappers.algoanBankAccountTypeMapper.fromDomain(BankAccountType.CARD);
    expect(result4).toEqual(AlgoanAccountType.CREDIT_CARD);
    // eslint-disable-next-line
    // @ts-ignore
    const result5 = dependencies.mappers.algoanBankAccountTypeMapper.fromDomain('NIMP');
    expect(result5).toBeUndefined();
  });

  it('should map transaction types', async () => {
    const transactions = await Promise.all(
      biTransactions.map(aTransaction =>
        // eslint-disable-next-line
        // @ts-ignore
        dependencies.mappers.budgetInsightTransactionMapper.toDomain(aTransaction),
      ),
    );
    const algoanTransaction = await Promise.all(
      transactions.map(aTransaction =>
        // eslint-disable-next-line
        // @ts-ignore
        dependencies.mappers.algoanTransactionMapper.fromDomain(aTransaction, { accountId: 'accountId' }),
      ),
    );
    const formattedTransactions = await Promise.all(
      algoanTransaction.map(
        aTransaction =>
          dependencies.mappers.algoanTransactionMapper.toDomain({
            ...aTransaction,
            id: 'id',
          }).props,
      ),
    );
    expect(algoanTransaction).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: AlgoanTransactionType.DEBIT,
        }),
        expect.objectContaining({
          type: AlgoanTransactionType.DIRECT_DEBIT,
        }),
        expect.objectContaining({
          type: AlgoanTransactionType.BANK_FEE,
        }),
      ]),
    );
    expect(formattedTransactions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: TransactionType.LOAN,
        }),
        expect.objectContaining({
          type: TransactionType.CHECK,
        }),
        expect.objectContaining({
          type: TransactionType.TRANSFER,
        }),
        expect.objectContaining({
          type: TransactionType.ATM,
        }),
      ]),
    );
  });

  it('should return UserUnknown exception', async () => {
    const user = User.create({
      userId: ALL_USERS['000000000'].userId,
      consent: true,
    });
    await dependencies.userRepository.create(user.props);
    await dependencies.userRepository.update(user.props.userId, ALL_USERS['000000000']);
    const result = dependencies.getCategorizedTransactions.execute({
      userId: ALL_USERS['000000000'].userId,
    });
    await expect(result).rejects.toThrow(CreditDecisioningError.UserUnknown);
  });

  it('should return AccountNotFound exception', async () => {
    const user = User.create({
      userId: ALL_USERS['111111111'].userId,
      consent: true,
    });
    await dependencies.userRepository.create(user.props);
    await dependencies.userRepository.update(user.props.userId, ALL_USERS['111111111']);
    const result = dependencies.getCategorizedTransactions.execute({
      userId: ALL_USERS['111111111'].userId,
    });
    await expect(result).rejects.toThrow(CreditDecisioningError.AccountNotFound);
  });

  it('should return TransactionsNotFound exception', async () => {
    const user = User.create({
      userId: ALL_USERS['222222222'].userId,
      consent: true,
    });
    await dependencies.userRepository.create(user.props);
    await dependencies.userRepository.update(user.props.userId, ALL_USERS['222222222']);
    const result = dependencies.getCategorizedTransactions.execute({
      userId: ALL_USERS['222222222'].userId,
    });

    await expect(result).rejects.toThrow(CreditDecisioningError.TransactionsNotFound);
  });

  it('should map correctly bankAccountOwnerIdentity', async () => {
    const fixtureFullIdentity = {
      owner: {
        email: 'email',
        name: 'hello',
      },
    };
    const resultFullIdentity = dependencies.mappers.ownerIdentityMapper.toDomain(fixtureFullIdentity);
    expect(resultFullIdentity).toEqual({
      identity: 'hello',
    });
  });

  it('should throw api response error if add accounts', async () => {
    const bankUserId = 'azesqd';
    const user = await createUser(kernel, userId);
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));

    user.update({ creditDecisioningUserId: bankUserId });
    const { bankAccounts: aggregatedBankAccounts } = await aggregateAccounts(kernel, userId, bankConnection);
    user.update({ aggregatedBankAccounts });

    const result = dependencies.creditDecisioningService.addBankAccountsToUser(user);
    await expect(result).rejects.toThrow(CreditDecisioningError.ApiResponseError);
  });

  it('should throw api response error if add transactions', async () => {
    const bankUserId = 'azejazhelui';
    const user = await createUser(kernel, userId);
    const bankConnection = await dependencies.signIn.execute(payloadSignIn(userId, stateCase.VALID));
    user.update({ creditDecisioningUserId: bankUserId });
    const { bankAccounts: aggregatedBankAccounts } = await aggregateAccounts(kernel, userId, bankConnection);
    user.update({ aggregatedBankAccounts });
    const result = dependencies.creditDecisioningService.addTransactionsToUser(user);
    await expect(result).rejects.toThrow(CreditDecisioningError.ApiResponseError);
  });
});
