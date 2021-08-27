import { BankAccountError } from '../models/BankAccountErrors';
import { AggregateAccountsField } from '../types/AggregateAccountsField';

export class AggregatedAccounts {
  constructor(private readonly accounts: AggregateAccountsField[]) {
    this.accounts = accounts;
  }

  validate(): AggregateAccountsField[] {
    if (this.accounts === undefined || !this.accounts.length) {
      throw new BankAccountError.FieldValidationFailure('At least one bank account must be provided');
    } else if (this.accounts.find(account => account.id === undefined)) {
      throw new BankAccountError.FieldValidationFailure('id field is missing');
    } else if (this.accounts.find(account => account.aggregated === undefined)) {
      throw new BankAccountError.FieldValidationFailure('aggregated field is missing');
    }
    return this.accounts;
  }
}
