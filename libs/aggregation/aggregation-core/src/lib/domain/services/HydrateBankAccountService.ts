import { Transaction } from '../entities/Transaction';
import { OwnerIdentity } from '../types/OwnerIdentity';

export interface HydrateBankAccountService {
  getOwnerIdentity(connectionId: string): Promise<OwnerIdentity>;
  getBankAccountTransactions(accountId: string): Promise<Transaction[]>;
}
