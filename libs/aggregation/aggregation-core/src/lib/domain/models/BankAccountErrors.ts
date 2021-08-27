import { DomainError } from '@oney/common-core';

export namespace BankAccountError {
  export class BankAccountNotFound extends DomainError {
    constructor(cause?: string | object) {
      super('BANK_ACCOUNT_NOT_FOUND', cause);
    }
  }
  export class FieldValidationFailure extends DomainError {
    constructor(cause?: string | object) {
      super('FIELD_VALIDATION_FAILURE', cause);
    }
  }
  export class NoAggregatedAccounts extends DomainError {
    constructor(cause?: string | object) {
      super('NO_AGGREGATED_ACCOUNTS', cause);
    }
  }
}
