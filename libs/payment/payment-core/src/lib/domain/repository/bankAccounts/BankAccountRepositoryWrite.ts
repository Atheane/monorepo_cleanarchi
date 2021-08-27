import { BankAccount } from '../../aggregates/BankAccount';

export interface BankAccountRepositoryWrite {
  save(bankAccount: BankAccount): Promise<BankAccount>;
}
