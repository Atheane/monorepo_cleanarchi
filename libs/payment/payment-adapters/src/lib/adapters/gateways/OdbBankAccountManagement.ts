import { BankAccountManagement, BankAccountType } from '@oney/payment-core';
import { injectable } from 'inversify';

interface BankAccountConfiguration {
  bankCreditAccount: string;
  bankAutoBalanceAccount: string;
  coverAccount: string;
  bankBillingAccount: string;
  bankLossAccount: string;
}

@injectable()
export class OdbBankAccountManagement implements BankAccountManagement {
  constructor(private readonly bankAccountConfiguration: BankAccountConfiguration) {}

  async handle(bankAccountType: BankAccountType, userAccountId: string): Promise<string> {
    switch (bankAccountType) {
      case BankAccountType.BANK_AUTOBALANCE_ACCOUNT:
        return this.bankAccountConfiguration.bankAutoBalanceAccount;
      /* istanbul ignore next: Waiting for PO for testing */
      case BankAccountType.BANK_BILLING_ACCOUNT:
        return this.bankAccountConfiguration.bankBillingAccount;
      case BankAccountType.BANK_CREDIT_ACCOUNT:
        return this.bankAccountConfiguration.bankCreditAccount;
      /* istanbul ignore next: Waiting for PO for testing */
      case BankAccountType.COVER_ACCOUNT:
        return this.bankAccountConfiguration.coverAccount;
      case BankAccountType.LOSS_ACCOUNT:
        return this.bankAccountConfiguration.bankLossAccount;
      case BankAccountType.USER_ACCOUNT:
        return userAccountId;
      /* istanbul ignore next: Had to add this default case because previously, the linter wasn't installed. */
      default:
        return null;
    }
  }
}
