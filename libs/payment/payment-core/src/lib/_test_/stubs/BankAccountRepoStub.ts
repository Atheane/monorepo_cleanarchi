import { BankAccount } from '../../domain/aggregates/BankAccount';
import { BankAccountRepositoryRead } from '../../domain/repository/bankAccounts/BankAccountRepositoryRead';
import { BankAccountRepositoryWrite } from '../../domain/repository/bankAccounts/BankAccountRepositoryWrite';

export class BankAccountRepoStub implements BankAccountRepositoryRead, BankAccountRepositoryWrite {
  private readonly inMemoryDb: BankAccount[];

  constructor(initialBankAccount: BankAccount[]) {
    this.inMemoryDb = initialBankAccount;
  }

  findByIban(iban: string): Promise<BankAccount> {
    const account = this.inMemoryDb.find(account => account.props.iban === iban);
    return Promise.resolve(account);
  }

  findById(id: string): Promise<BankAccount> {
    const account = this.inMemoryDb.find(account => account.id === id);
    return Promise.resolve(account);
  }

  save(bankAccount: BankAccount): Promise<BankAccount> {
    this.inMemoryDb.push(bankAccount);
    return Promise.resolve(bankAccount);
  }

  getAll(): Promise<BankAccount[]> {
    return Promise.resolve(this.inMemoryDb);
  }
}
