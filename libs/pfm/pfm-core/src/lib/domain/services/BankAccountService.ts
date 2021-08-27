import { BankAccount } from '../entities/BankAccount';

export interface BankAccountService {
  getBankAccounts(userId: string, userToken: string): Promise<BankAccount[]>;
}
