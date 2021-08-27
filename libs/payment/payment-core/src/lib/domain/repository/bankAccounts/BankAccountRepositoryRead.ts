import { BankAccount } from '../../aggregates/BankAccount';

export interface BankAccountRepositoryRead {
  findByIban(iban: string): Promise<BankAccount>;
  findById(id: string): Promise<BankAccount>;
  getAll(): Promise<BankAccount[]>;
}
