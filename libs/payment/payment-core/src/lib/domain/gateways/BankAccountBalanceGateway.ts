import { AccountBalance } from '../types/AccountBalance';

export interface BankAccountBalanceGateway {
  getBalance(uid: string): Promise<AccountBalance>;
}
