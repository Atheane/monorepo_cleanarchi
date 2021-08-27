import {
  BankAccountProperties,
  AggregationIdentifier,
  BankAccount,
  BankAccountGateway,
  BankAccountError,
  BankConnectionRepository,
  BankAccountRepository,
} from '@oney/aggregation-core';
import { defaultLogger } from '@oney/logger-adapters';
import { inject, injectable } from 'inversify';
import { Currency } from '@oney/common-core';
import { BankAccountMapper } from '../mappers/BankAccountMapper';
import {
  BIConnectionService,
  selectedAccountTypes,
  BudgetInsightAccountUsage,
  BudgetInsightAccount,
} from '../partners';

@injectable()
export class BIBankAccountGateway implements BankAccountGateway {
  constructor(
    private readonly biConnectionService: BIConnectionService,
    @inject(AggregationIdentifier.bankAccountMapper)
    private readonly bankAccountMapper: BankAccountMapper,
    @inject(AggregationIdentifier.bankConnectionRepository)
    private readonly bankConnectionRepository: BankConnectionRepository,
    @inject(AggregationIdentifier.bankAccountRepository)
    private readonly bankAccountRepository: BankAccountRepository,
  ) {}

  async updateAccounts(
    refId: string,
    accounts: Pick<BankAccountProperties, 'id' | 'name' | 'aggregated'>[],
  ): Promise<BankAccount[]> {
    // BI needs that each promise wait for resolves before next call
    await accounts.reduce(
      (promiseChain, account) => promiseChain.then(() => this.renameAccount(refId, account)),
      Promise.resolve(),
    );
    return this.updateAccountsByConnectionId(refId, accounts);
  }

  async disaggregateAccounts(accounts: Pick<BankAccountProperties, 'id'>[]): Promise<BankAccount[]> {
    const biAccounts = await this.biConnectionService.disaggregateAccounts(accounts);
    return Promise.all(
      biAccounts.map(async account => {
        const refId = account.id_connection.toString();
        const bankConnection = await this.bankConnectionRepository.findBy({ refId });
        const dtoAccount = this.bankAccountMapper.toDomain({ raw: account, bankConnection });
        return this.bankAccountRepository.save({ ...dtoAccount.props, aggregated: false });
      }),
    );
  }

  async getAccountsFromRefId(refId: string): Promise<BankAccount[]> {
    const { accounts } = await this.biConnectionService.getAccountsByConnectionId(refId);
    return this.filterBankAccounts(accounts);
  }

  private async renameAccount(
    refId: string,
    account: Pick<BankAccountProperties, 'id' | 'name'>,
  ): Promise<BankAccount> {
    try {
      const result = await this.biConnectionService.renameAccount(refId, account);
      const connectionRefId = result.id_connection.toString();
      const bankConnection = await this.bankConnectionRepository.findBy({ refId: connectionRefId });
      return this.bankAccountMapper.toDomain({ raw: result, bankConnection });
    } catch (e) {
      /* istanbul ignore next: waiting for istanbul to support typescript optional chaining operator */
      defaultLogger.error('@oney/aggregation.BIBankAccountGateway.renameAccount.catch', e?.response?.data);
      throw new BankAccountError.BankAccountNotFound();
    }
  }

  private async updateAccountsByConnectionId(
    refId: string,
    accounts: Pick<BankAccountProperties, 'id' | 'name' | 'aggregated'>[],
  ): Promise<BankAccount[]> {
    const result = await this.biConnectionService.updateAccountsByConnectionId(refId, accounts);
    return Promise.all(
      result.map(async account => {
        const connectionRefId = account.id_connection.toString();
        const bankConnection = await this.bankConnectionRepository.findBy({ refId: connectionRefId });
        return this.bankAccountMapper.toDomain({ raw: account, bankConnection });
      }),
    );
  }

  async filterBankAccounts(bankAccounts: BudgetInsightAccount[]): Promise<BankAccount[]> {
    const accountTypesMap = await this.biConnectionService.getAccountTypes();
    const dynamicAccountTypeIds = accountTypesMap.accounttypes
      .filter(type => selectedAccountTypes.includes(type.name))
      .map(type => type.id);
    /* istanbul ignore next : waiting for istanbul to support typescript optional chaining operator, same below */
    const filterInEuros = account => account.currency?.id === Currency.EUR || account.currency === null; // waiting for BI correction, currency should not be null
    const filterAccountTypes = account => dynamicAccountTypeIds.includes(account.id_type);
    const filterPrivateUsage = account =>
      account.usage === BudgetInsightAccountUsage.PRIV || account.usage === null; // do not delete account.usage === null, it happens often
    return Promise.all(
      bankAccounts
        .filter(filterInEuros)
        .filter(filterAccountTypes)
        .filter(filterPrivateUsage)
        .map(async account => {
          const bankConnection = await this.bankConnectionRepository.findBy({
            refId: account.id_connection.toString(),
          });
          return this.bankAccountMapper.toDomain({ raw: account, bankConnection });
        }),
    );
  }
}
