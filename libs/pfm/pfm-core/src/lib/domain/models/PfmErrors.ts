import { DomainError } from '@oney/common-core';

export namespace TransactionError {
  export class AccountNotFound extends DomainError {
    constructor(cause?: any) {
      super('ACCOUNT_NOT_FOUND', cause);
    }
  }
  export class InvalidQuery extends DomainError {
    constructor(cause?: any) {
      super('INVALID_QUERY', cause);
    }
  }
  export class TransactionNotFound extends DomainError {
    constructor(cause?: any) {
      super('TRANSACTION_NOT_FOUND', cause);
    }
  }
}

export namespace P2PError {
  export class SenderNotFound extends DomainError {
    constructor(cause?: any) {
      super('SENDER_NOT_FOUND', cause);
    }
  }

  export class TechnicalBankAccountNotFound extends DomainError {
    constructor(cause?: any) {
      super('TECHNICAL_BANK_ACCOUNT_NOT_FOUND', cause);
    }
  }
}

export namespace GenericError {
  export class ApiResponseError extends DomainError {
    constructor(cause?: any) {
      super('API_RESPONSE_ERROR', cause);
    }
  }
}

export namespace RbacError {
  export class UserCannotRead extends DomainError {}
}
