import { defaultLogger } from '@oney/logger-adapters';
import { inject, injectable } from 'inversify';
import {
  Algoan,
  Account as AlgoanAccount,
  AlgoanAccountNotFound,
  AlgoanTransactionsNotFound,
} from '@oney/algoan';
import {
  CreditDecisioningError,
  CreditProfile,
  CreditDecisioningService,
  HydrateBankAccountService,
  BankAccount,
  Transaction,
  AggregationIdentifier,
  BankConnectionRepository,
  IAppConfiguration,
  BankRepository,
  User,
} from '@oney/aggregation-core';
import { Aden } from './models/aden-analysis/Aden';
import { AlgoanBankAccountMapper } from '../../mappers/AlgoanBankAccountMapper';
import { AlgoanTransactionMapper } from '../../mappers/AlgoanTransactionMapper';
import { CreditProfileMapper } from '../../mappers/CreditProfileMapper';

@injectable()
export class AlgoanCreditDecisioningService implements CreditDecisioningService {
  private readonly algoanClient: Algoan;

  constructor(
    @inject(AggregationIdentifier.algoanBankAccountMapper)
    private readonly algoanBankAccountMapper: AlgoanBankAccountMapper,
    @inject(AggregationIdentifier.appConfiguration) private readonly appConfiguration: IAppConfiguration,
    @inject(AggregationIdentifier.hydrateBankAccountService)
    private readonly hydrateBankAccountService: HydrateBankAccountService,
    @inject(AggregationIdentifier.algoanTransactionMapper)
    private readonly algoanTransactionMapper: AlgoanTransactionMapper,
    @inject(AggregationIdentifier.creditProfileMapper)
    private readonly creditProfileMapper: CreditProfileMapper,
    @inject(AggregationIdentifier.bankConnectionRepository)
    private readonly bankConnectionRepository: BankConnectionRepository,
    @inject(AggregationIdentifier.bankRepository) private readonly bankRepository: BankRepository,
  ) {
    this.algoanClient = new Algoan();
    this.algoanClient.initDependencies(this.appConfiguration.algoanConfig);
  }

  async createCreditDecisioningUser(): Promise<string> {
    const { creatBankUser } = this.algoanClient.getUseCases();

    try {
      const { id } = await creatBankUser.execute();
      return id;
    } catch (e) {
      /* istanbul ignore next: waiting for istanbul to support typescript optional chaining operator */
      const errorMessage = e?.response?.data;
      defaultLogger.error(
        '@oney/aggregation.AlgoanCreditDecisioningService.createCreditDecisioningUser.catch',
        errorMessage,
      );
      throw new CreditDecisioningError.ApiResponseError(errorMessage);
    }
  }

  async addBankAccountsToUser(user: User): Promise<BankAccount[]> {
    const { addBankAccountToUser } = this.algoanClient.getUseCases();
    return Promise.all(
      user.props.aggregatedBankAccounts.map(async anAggregatedAccount => {
        const bank = await this.bankRepository.getById(anAggregatedAccount.props.bankId);
        const accountProperties = await this.algoanBankAccountMapper.fromDomain({
          bankAccount: anAggregatedAccount,
          bank,
        });
        try {
          const algoanBankAccount: AlgoanAccount = await addBankAccountToUser.execute({
            bankUserId: user.props.creditDecisioningUserId,
            accountProperties,
          });
          return this.algoanBankAccountMapper.toDomain({
            raw: algoanBankAccount,
            bankConnection: await this.bankConnectionRepository.findBy({
              connectionId: anAggregatedAccount.props.connectionId,
            }),
          }).bankAccount;
        } catch (e) {
          /* istanbul ignore next: waiting for istanbul to support typescript optional chaining operator */
          const errorMessage = e?.response?.data;
          defaultLogger.error(
            '@oney/aggregation.AlgoanCreditDecisioningService.addBankAccountsToUser.catch',
            errorMessage,
          );
          throw new CreditDecisioningError.ApiResponseError(errorMessage);
        }
      }),
    );
  }

  async addTransactionsToUser(user: User): Promise<Transaction[]> {
    const { addTransactionsToAccount, finalizeBankAccountCreation } = this.algoanClient.getUseCases();
    let totalUnsavedTransactions: Transaction[] = [];
    try {
      await Promise.all(
        user.props.aggregatedBankAccounts.map(async anAggregatedAccount => {
          const transactions = await this.hydrateBankAccountService.getBankAccountTransactions(
            anAggregatedAccount.props.id,
          );
          const addTransactionToAccountCommand = {
            bankUserId: user.props.creditDecisioningUserId,
            accountId: anAggregatedAccount.props.creditDecisioningAccountId,
            transactions: transactions.map(transaction =>
              this.algoanTransactionMapper.fromDomain({
                ...transaction,
                accountId: anAggregatedAccount.props.creditDecisioningAccountId,
              }),
            ),
          };
          const algoanTransactions = await addTransactionsToAccount.execute(addTransactionToAccountCommand);
          const unsavedTransactions = algoanTransactions.map(anAlgoanTransaction =>
            this.algoanTransactionMapper.toDomain(anAlgoanTransaction),
          );
          totalUnsavedTransactions = [...unsavedTransactions, ...totalUnsavedTransactions];
        }),
      );
      await finalizeBankAccountCreation.execute(user.props.creditDecisioningUserId);

      return totalUnsavedTransactions;
    } catch (e) {
      /* istanbul ignore next: waiting for istanbul to support typescript optional chaining operator */
      const errorMessage = e?.response?.data;
      defaultLogger.error(
        '@oney/aggregation.AlgoanCreditDecisioningService.addTransactionsToUser.catch',
        errorMessage,
      );
      throw new CreditDecisioningError.ApiResponseError(e);
    }
  }

  async getCategorizedTransactions(bankUserId: string): Promise<Transaction[]> {
    try {
      const { getAllAccountsTransactions } = this.algoanClient.getUseCases();
      const algoanAccounts = await getAllAccountsTransactions.execute(bankUserId);
      return algoanAccounts
        .map(anAlgoanAccount =>
          anAlgoanAccount.transactions.map(anAlgoanTransaction =>
            this.algoanTransactionMapper.toDomain(anAlgoanTransaction),
          ),
        )
        .flat();
    } catch (error) {
      switch (error.code) {
        case new AlgoanAccountNotFound().code:
          throw new CreditDecisioningError.AccountNotFound();
        case new AlgoanTransactionsNotFound().code:
          throw new CreditDecisioningError.TransactionsNotFound();
        default:
          throw new CreditDecisioningError.ApiResponseError(error);
      }
    }
  }

  async getBankUserCreditProfile(creditDecisioningUserId: string): Promise<CreditProfile> {
    const { getBankUserCreditAnalysis } = this.algoanClient.getUseCases();
    const creditAnalysis: Aden[] = await getBankUserCreditAnalysis.execute({
      bankUserId: creditDecisioningUserId,
    });
    if (creditAnalysis.length === 0) return null;
    return this.creditProfileMapper.toDomain(creditAnalysis[0]);
  }
}
