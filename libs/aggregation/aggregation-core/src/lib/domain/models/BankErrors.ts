import { DomainError } from '@oney/common-core';

export namespace BankError {
  export class BankNotFound extends DomainError {
    constructor(cause?: string | object) {
      super('BANK_NOT_FOUND', cause);
    }
  }

  export class InvalidBankCode extends DomainError {
    constructor(cause?: string | object) {
      super('INVALID_BANK_CODE', cause);
    }
  }
}
