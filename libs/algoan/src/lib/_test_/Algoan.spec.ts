import { Algoan, AlgoanConfig } from '@oney/algoan';
import * as nock from 'nock';
import * as path from 'path';
import {
  algoanGetAllAccountsTransactionsData,
  anAccountProperties,
  aTransactionProperties,
} from './fixtures/data';
import { AlgoanAccountNotFound } from '../domain/models/AlgoanAccountNotFound';
import { AlgoanTransactionsNotFound } from '../domain/models/AlgoanTransactionsNotFound';
import { BankUser, BankUserStatus } from '../domain/models/BankUser';
import { AddBankAccountCommand } from '../usecases/types/AddBankAccountCommand';
import { AddTransactionsCommand } from '../usecases/types/AddTransactionsCommand';

const nockBack = nock.back;
nockBack.fixtures = path.resolve(`${__dirname}/fixtures`);
nockBack.setMode('record');

describe('Test lib Algoan', () => {
  const bankUserId = '6066fdd6c9624826de78b6f7';
  const accountId = '6066fdf5c96248acec78b6f8';
  const algoanConfig: AlgoanConfig = {
    baseUrl: 'https://api.preprod.algoan.com/v1',
    clientId: 'oney-score-1',
    clientSecret: '42cbb0bd-dbf1-49a7-88e9-6524c195be6c',
    longPolling: {
      interval: 200,
      maxAttemps: 2,
    },
  };

  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('should create bank user in algoan', async () => {
    const { nockDone } = await nockBack('algoan.createBankUser.json');
    const algoan = new Algoan();
    algoan.initDependencies(algoanConfig);
    const { creatBankUser } = algoan.getUseCases();

    const result = await creatBankUser.execute();

    const expectedBankUser = {
      id: bankUserId,
      status: BankUserStatus.NEW,
      adenTriggers: { onSynchronizationFinished: true },
    } as BankUser;
    expect(result).toEqual(expectedBankUser);
    nockDone();
  });

  it('should add bank account to user in algoan', async () => {
    const { nockDone } = await nockBack('algoan.addBankAccount.json');
    const algoan = new Algoan();
    algoan.initDependencies(algoanConfig);
    const { addBankAccountToUser } = algoan.getUseCases();
    const accountProperties = anAccountProperties;
    const addBankAccountCommand = {
      bankUserId,
      accountProperties: accountProperties,
    } as AddBankAccountCommand;

    const result = await addBankAccountToUser.execute(addBankAccountCommand);
    expect(result).toEqual({
      ...accountProperties,
      id: accountId,
    });
    nockDone();
  });

  it('should return empty array when list of transactions is added with success to algoan', async () => {
    const { nockDone } = await nockBack('algoan.addTransactions.json');
    const algoan = new Algoan();
    algoan.initDependencies(algoanConfig);
    const { addTransactionsToAccount } = algoan.getUseCases();
    const addTransactionsCommand = {
      accountId: accountId,
      bankUserId: bankUserId,
      transactions: [aTransactionProperties],
    } as AddTransactionsCommand;

    const result = await addTransactionsToAccount.execute(addTransactionsCommand);

    expect(result).toEqual([]);

    nockDone();
  });

  it('should return list of transactions failed to be added to algoan', async () => {
    const { nockDone } = await nockBack('algoan.addTransactions.fail.json');
    const algoan = new Algoan();
    algoan.initDependencies(algoanConfig);
    const { addTransactionsToAccount } = algoan.getUseCases();
    const failingTransactionProperties = { ...aTransactionProperties };
    failingTransactionProperties.amount = null;
    const addTransactionsCommand = {
      accountId: accountId,
      bankUserId: bankUserId,
      transactions: [failingTransactionProperties],
    } as AddTransactionsCommand;

    const result = await addTransactionsToAccount.execute(addTransactionsCommand);
    expect(result).toEqual([expect.objectContaining({ ...failingTransactionProperties })]);

    nockDone();
  });

  it('should finalize the creation of bank user in algoan', async () => {
    const { nockDone } = await nockBack('algoan.finalizeBankUserCreation.json');
    const algoan = new Algoan();
    algoan.initDependencies(algoanConfig);
    const { finalizeBankAccountCreation } = algoan.getUseCases();

    const result = await finalizeBankAccountCreation.execute(bankUserId);

    const expectedBankUser = {
      id: bankUserId,
      status: BankUserStatus.FINISHED,
      adenTriggers: { onSynchronizationFinished: true },
    } as BankUser;
    expect(result).toEqual(expectedBankUser);
    nockDone();
  });

  it("should return the list of transactions from the user's accounts", async () => {
    const { nockDone } = await nockBack('algoan.getAllAccountsTransactions.json');
    const algoan = new Algoan();
    algoan.initDependencies(algoanConfig);
    const { getAllAccountsTransactions } = algoan.getUseCases();
    const result = await getAllAccountsTransactions.execute(bankUserId);
    expect(result).toEqual(algoanGetAllAccountsTransactionsData);
    nockDone();
  });

  it('should return AlgoanAccountNotFound exception', async () => {
    const { nockDone } = await nockBack('algoan.getAllAccountsTransactions_AlgoanAccountNotFound.json');
    const algoan = new Algoan();
    algoan.initDependencies(algoanConfig);

    const { getAllAccountsTransactions } = algoan.getUseCases();
    const result = getAllAccountsTransactions.execute('5fca336d96c9b410a1688d4z');

    await expect(result).rejects.toThrow(AlgoanAccountNotFound);
    nockDone();
  });

  it('should return AlgoanTransactionsNotFound exception', async () => {
    const { nockDone } = await nockBack('algoan.getAllAccountsTransactions_AlgoanTransactionsNotFound.json');
    const algoan = new Algoan();
    algoan.initDependencies(algoanConfig);

    const { getAllAccountsTransactions } = algoan.getUseCases();
    const result = getAllAccountsTransactions.execute('5fd8a814a5ef007e89fd8f88');
    await expect(result).rejects.toThrow(AlgoanTransactionsNotFound);
    nockDone();
  });

  it('getBankUserCreditAnalysis usecase should return Aden if Algoan service analysis was finished', async () => {
    const { nockDone } = await nockBack('algoan.getUserBankCreditScore-success.json');
    const bankUserIdSucces = '5fd4e7df96c9b48e6268c5b7';
    const algoan = new Algoan();
    algoan.initDependencies(algoanConfig);
    const { getBankUserCreditAnalysis } = algoan.getUseCases();

    const [creditScoring] = await getBankUserCreditAnalysis.execute({ bankUserId: bankUserIdSucces });

    expect(creditScoring).toBeTruthy();
    nockDone();
  });

  it('getBankUserCreditAnalysis usecase should return empty scoring if Algoan service analysis was not finished', async () => {
    const { nockDone } = await nockBack('algoan.getUserBankCreditScore-not-ready.json');
    const bankUserIdNotReadyScoring = '5fcd01ee96c9b408bb688dcb';
    const algoan = new Algoan();
    algoan.initDependencies(algoanConfig);
    const { getBankUserCreditAnalysis } = algoan.getUseCases();

    const creditScoring = await getBankUserCreditAnalysis.execute({ bankUserId: bankUserIdNotReadyScoring });

    expect(creditScoring).toEqual([]);
    nockDone();
  });
});
