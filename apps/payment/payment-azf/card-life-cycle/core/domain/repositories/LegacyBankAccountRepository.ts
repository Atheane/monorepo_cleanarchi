import { LegacyBankAccount } from '../entities/LegacyBankAccount';

export interface BankAccountRepository {
  findByCardId(cid: string): Promise<LegacyBankAccount>;
  save?(account: LegacyBankAccount): Promise<LegacyBankAccount>;
}
