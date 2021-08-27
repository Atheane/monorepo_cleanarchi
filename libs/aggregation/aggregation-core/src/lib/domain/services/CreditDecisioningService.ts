import { BankAccount, User } from '../aggregates';
import { Transaction } from '../entities';
import { CreditProfile } from '../types';

export interface CreditDecisioningService {
  createCreditDecisioningUser(): Promise<string>;
  addBankAccountsToUser(user: User): Promise<BankAccount[]>;
  addTransactionsToUser(user: User): Promise<Transaction[]>;
  getCategorizedTransactions(creditDecisioningUserId: string): Promise<Transaction[]>;
  getBankUserCreditProfile(creditDecisioningUserId: string): Promise<CreditProfile>;
}
