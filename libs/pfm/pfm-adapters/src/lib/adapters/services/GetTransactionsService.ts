import { Logger, SymLogger } from '@oney/logger-core';
import { inject, injectable } from 'inversify';
import {
  OrderEnum,
  PfmIdentifiers,
  Transaction,
  TransactionQueryType,
  TransactionService,
} from '@oney/pfm-core';
import { TransactionSource } from '@oney/common-core';
import { TransactionSmoneyP2pMapper } from '../mappers';
import { SMoneyBankAccountRepository, SMoneyTransactionRepository } from '../repositories';
import { BudgetInsightTransactionRepository, MongodbP2pRepository } from '../mongodb';

@injectable()
export class GetTransactionsService implements TransactionService {
  constructor(
    @inject(PfmIdentifiers.budgetInsightTransactionRepository)
    private readonly budgetInsightTransactionRepository: BudgetInsightTransactionRepository,
    @inject(PfmIdentifiers.smoneyTransactionRepository)
    private readonly smoneyTransactionRepository: SMoneyTransactionRepository,
    @inject(PfmIdentifiers.p2pRepository)
    private readonly p2pRepository: MongodbP2pRepository,
    @inject(PfmIdentifiers.smoneyBankAccountRepository)
    private readonly smoneyBankAccountRepository: SMoneyBankAccountRepository,
    @inject(PfmIdentifiers.mappers.transactionSMoneyP2pMapper)
    private readonly transactionSMoneyP2pMapper: TransactionSmoneyP2pMapper,
    @inject(SymLogger)
    private readonly logger: Logger,
  ) {}

  sortByDate(item: Transaction, nextItem: Transaction, order: OrderEnum): number {
    if (order === OrderEnum.ASC) {
      return new Date(item.date).getTime() - new Date(nextItem.date).getTime();
    }
    return new Date(nextItem.date).getTime() - new Date(item.date).getTime();
  }

  async getAllTransactions({
    accountsIds,
    userId,
    userToken,
    options,
    transactionSources,
  }: {
    accountsIds: string[];
    userId?: string;
    userToken?: string;
    options?: TransactionQueryType;
    transactionSources?: TransactionSource[];
  }): Promise<Transaction[]> {
    // this.logger.addTag(`${this.constructor.name}.getAllTransactions`);
    let budgetInsightTransactions: Transaction[] = [];
    let p2pTransactions: Transaction[] = [];

    const smoneyTransactions: Transaction[] = await this.smoneyTransactionRepository.getByAccountId({
      accountId: userId,
      userToken,
      options,
    });

    if (!transactionSources || transactionSources.includes(TransactionSource.AGGREGATED)) {
      budgetInsightTransactions = await this.budgetInsightTransactionRepository.getAll(accountsIds, options);
    }

    try {
      const smoneyBankAccounts = await this.smoneyBankAccountRepository.getAll(userId);

      const rawP2pTransactions = await this.p2pRepository.getAll(
        smoneyBankAccounts.map(item => item.id),
        options,
      );
      p2pTransactions = rawP2pTransactions.map(raw =>
        this.transactionSMoneyP2pMapper.toDomain({ smoneyBankAccounts, raw }),
      );
    } catch (e) {
      /* istanbul ignore next: waiting for istanbul to support typescript optional chaining operator, same below */
      this.logger.error(
        `GetTransactionsService > getAllTransactions p2pTransactions ${e?.response?.data?.code}`,
        e?.response?.data || e,
      );
    }
    const sortBy = options?.sortBy ?? OrderEnum.DESC;
    return [...smoneyTransactions, ...budgetInsightTransactions, ...p2pTransactions].sort((item, nextItem) =>
      this.sortByDate(item, nextItem, sortBy),
    );
  }

  async getTransactionsByAccountId({
    accountId,
    userId,
    userToken,
    options,
  }: {
    accountId: string;
    userId?: string;
    userToken?: string;
    options?: TransactionQueryType;
  }): Promise<Transaction[]> {
    let p2pTransactions: Transaction[] = [];
    const smoneyTransactions: Transaction[] = await this.smoneyTransactionRepository.getByAccountId({
      accountId: userId,
      userToken,
      options,
    });
    if (smoneyTransactions.find(transaction => transaction.bankAccountId === accountId)) {
      try {
        const smoneyBankAccounts = await this.smoneyBankAccountRepository.getAll(userId);
        const rawP2pTransactions = await this.p2pRepository.getAll([accountId], options);
        p2pTransactions = rawP2pTransactions.map(raw =>
          this.transactionSMoneyP2pMapper.toDomain({ smoneyBankAccounts, raw }),
        );
      } catch (e) {
        /* istanbul ignore next */
        this.logger.error(
          `GetTransactionsService > getTransactionsByAccountId p2pTransactions ${e?.response?.data?.code}`,
          e?.response?.data,
        );
      }

      const sortBy = options?.sortBy ?? OrderEnum.DESC;
      return [...smoneyTransactions, ...p2pTransactions].sort((item, nextItem) =>
        this.sortByDate(item, nextItem, sortBy),
      );
    }
    return this.budgetInsightTransactionRepository.getByAccountId({
      accountId,
      options,
    });
  }

  async getTransactionById({
    userId,
    userToken,
    transactionId,
  }: {
    userId: string;
    userToken: string;
    transactionId: string;
  }): Promise<Transaction> {
    let transaction: Transaction;
    transaction = await this.smoneyTransactionRepository.getByTransactionId({
      userId,
      userToken,
      transactionId,
    });
    if (!transaction) {
      transaction = await this.budgetInsightTransactionRepository.getByTransactionId(transactionId);
      const raw = await this.p2pRepository.getById(transactionId);
      if (raw) {
        const smoneyBankAccounts = await this.smoneyBankAccountRepository.getAll(userId);
        transaction = this.transactionSMoneyP2pMapper.toDomain({
          smoneyBankAccounts,
          raw,
        });
      }
    }
    return transaction;
  }
}
