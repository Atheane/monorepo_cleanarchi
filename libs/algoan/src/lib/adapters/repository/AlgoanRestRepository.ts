import { inject, injectable } from 'inversify';
import { AlgoanHttpClient } from '../../bootstrap/AlgoanHttpClient';
import { Identifiers } from '../../bootstrap/Identifiers';
import { Account, AccountProperties } from '../../domain/models/Account';
import { Aden } from '../../domain/models/Aden/Aden';
import { AlgoanAccountNotFound } from '../../domain/models/AlgoanAccountNotFound';
import { BankUser, BankUserProperties } from '../../domain/models/BankUser';
import { Transaction, TransactionProperties } from '../../domain/models/Transaction';
import { AlgoanRepository } from '../../domain/port/AlgoanRepository';
import { ILongPolling } from '../infra/network/ILongPolling';
import { AccountMapper } from '../mapper/AccountMapper';
import { BankUserMapper } from '../mapper/BankUserMapper';
import { TransactionMapper } from '../mapper/TransactionMapper';
import { AlgoanAccountDto } from '../models/AlgoanAccountDto';
import { AlgoanBankUserDto } from '../models/AlgoanBankUserDto';
import {
  AlgoanTransactionElementsDto,
  AlgoanTransactionResourceDto,
} from '../models/AlgoanTransactionElementsDto';

@injectable()
export class AlgoanRestRepository implements AlgoanRepository {
  constructor(
    @inject(Identifiers.AccountMapper) private readonly _accountMapper: AccountMapper,
    @inject(Identifiers.BankUserMapper) private readonly _bankUserMapper: BankUserMapper,
    @inject(Identifiers.TransactionMapper) private readonly _transactionMapper: TransactionMapper,
    @inject(Identifiers.AlgoanHttpClient) private readonly _algoanHttpClient: AlgoanHttpClient,
    @inject(Identifiers.LongPolling) private readonly _longPolling: ILongPolling,
  ) {}

  async creatBankUser(bankUserProperties: BankUserProperties): Promise<BankUser> {
    await this._algoanHttpClient.authenticate();
    const algoanResponse = await this._algoanHttpClient.client
      .post<AlgoanBankUserDto>('/banks-users', bankUserProperties)
      .execute();
    return this._bankUserMapper.toDomain(algoanResponse.data);
  }

  async addBankAccount(account: AccountProperties, bankUserId: string): Promise<Account> {
    await this._algoanHttpClient.authenticate();
    const algoanResponse = await this._algoanHttpClient.client
      .post<AlgoanAccountDto>(`/banks-users/${bankUserId}/accounts`, account)
      .execute();
    return this._accountMapper.toDomain(algoanResponse.data);
  }

  async addTransactions(
    transactions: TransactionProperties[],
    accountId: string,
    bankUserId: string,
  ): Promise<Transaction[]> {
    await this._algoanHttpClient.authenticate();
    const algoanResponse = await this._algoanHttpClient.client
      .post<AlgoanTransactionElementsDto>(
        `/banks-users/${bankUserId}/accounts/${accountId}/transactions`,
        transactions,
      )
      .execute();
    const { elements } = algoanResponse.data;
    return elements
      .filter(element => element.httpCode !== 'CREATED')
      .map(element => element.resource)
      .map(algoanTransactionResource => this._transactionMapper.toDomain(algoanTransactionResource));
  }

  async finalize(bankUserId: string, bankUserProperties: BankUserProperties): Promise<BankUser> {
    await this._algoanHttpClient.authenticate();
    const algoanResponse = await this._algoanHttpClient.client
      .patch<AlgoanBankUserDto>(`/banks-users/${bankUserId}`, bankUserProperties)
      .execute();
    return this._bankUserMapper.toDomain(algoanResponse.data);
  }

  async getAllAccounts(bankUserId: string): Promise<Account[]> {
    await this._algoanHttpClient.authenticate();
    const response = await this._algoanHttpClient.client
      .get<AlgoanAccountDto[]>(`/banks-users/${bankUserId}/accounts`)
      .execute();
    const result: Account[] = response.data.map(account => this._accountMapper.toDomain(account));
    if (result.length === 0) throw new AlgoanAccountNotFound();
    return result;
  }

  async getAllAccountTransactions(
    bankUserId: string,
    accountId: string,
    accountReference: string,
  ): Promise<Transaction[]> {
    const getAllAccountTransactionsRequest = this._algoanHttpClient.client.get<
      AlgoanTransactionResourceDto[]
    >(`/banks-users/${bankUserId}/accounts/${accountId}/transactions`).execute;
    const longPollingSuccessCondition = result =>
      result.data.length === 0 ||
      result.data.filter(aTransaction => aTransaction.algoanBankAccountMapper !== undefined).length > 0;
    await this._algoanHttpClient.authenticate();
    const allAccountTransactions = await this._longPolling.polling<AlgoanTransactionResourceDto[]>(
      getAllAccountTransactionsRequest,
      longPollingSuccessCondition,
    );
    const result: Transaction[] = allAccountTransactions.map(transaction => {
      return { ...this._transactionMapper.toDomain(transaction), referenceAccound: accountReference };
    });
    return result;
  }

  async getBankUserCreditAnalysis(bankUserId: string): Promise<Aden[]> {
    const getBankUserRequest = this._algoanHttpClient.client.get<AlgoanBankUserDto>(
      `banks-users/${bankUserId}`,
    ).execute;
    const longPollingSuccessCondition = result => result.data.aden.length !== 0;
    await this._algoanHttpClient.authenticate();
    const bankUserAlgoan = await this._longPolling.polling<AlgoanBankUserDto>(
      getBankUserRequest,
      longPollingSuccessCondition,
    );
    return bankUserAlgoan.aden;
  }
}
