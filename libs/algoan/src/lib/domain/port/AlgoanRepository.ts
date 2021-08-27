import { Account, AccountProperties } from '../models/Account';
import { Aden } from '../models/Aden/Aden';
import { BankUser, BankUserProperties } from '../models/BankUser';
import { Transaction, TransactionProperties } from '../models/Transaction';

export interface AlgoanRepository {
  creatBankUser(bankUserProperties: BankUserProperties): Promise<BankUser>;

  addBankAccount(account: AccountProperties, bankUserId: string): Promise<Account>;

  addTransactions(
    transactions: TransactionProperties[],
    accountId: string,
    bankUserId: string,
  ): Promise<Transaction[]>;

  finalize(bankUserId: string, bankUserProperties: BankUserProperties): Promise<BankUser>;

  getAllAccountTransactions(
    bankUserId: string,
    accountId: string,
    accountReference: string,
  ): Promise<Transaction[]>;

  getAllAccounts(bankUserId: string): Promise<Account[]>;

  getBankUserCreditAnalysis(bankUserId: string): Promise<Aden[]>;
}
