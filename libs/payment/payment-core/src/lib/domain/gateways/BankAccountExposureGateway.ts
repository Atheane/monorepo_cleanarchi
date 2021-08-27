import { BankAccount } from '../aggregates/BankAccount';

export interface BankAccountExposureGateway {
  updateBankAccountExposure(bankAccount: BankAccount): Promise<void>;
}
