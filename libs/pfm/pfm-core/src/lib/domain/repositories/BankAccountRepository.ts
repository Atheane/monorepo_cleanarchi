import { BankAccount } from '../entities/BankAccount';

export interface BankAccountRepository {
  getAll(userId: string, userToken?: string): Promise<BankAccount[]>;
}
