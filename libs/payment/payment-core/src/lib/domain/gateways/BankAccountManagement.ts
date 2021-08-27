import { BankAccountType } from '../types/BankAccountType';

export interface BankAccountManagement {
  handle(bankAccountType: BankAccountType, userAccountId: string): Promise<string>;
}
