import { DomainError } from '@oney/common-core';

export namespace CreditDecisioningError {
  export class ApiResponseError extends DomainError {
    constructor(cause?: string | object) {
      super('API_RESPONSE_ERROR', cause);
    }
  }
  export class TransactionsAlreadyPosted extends DomainError {
    constructor(cause?: string | object) {
      super('TRANSACTIONS_ALREADY_POSTED', cause);
    }
  }
  export class AccountNotFound extends DomainError {
    constructor(cause?: string | object) {
      super('CREDIT_DECISIONING_ACCOUNT_NOT_FOUND', cause);
    }
  }
  export class TransactionsNotFound extends DomainError {
    constructor(cause?: string | object) {
      super('CREDIT_DECISIONING_TRANSACTIONS_NOT_FOUND', cause);
    }
  }
  export class UserUnknown extends DomainError {
    constructor(cause?: string | object) {
      super('CREDIT_DECISIONING_USER_UNKNOWN', cause);
    }
  }
  export class CreditProfileNotFound extends DomainError {
    constructor(cause?: string | object) {
      super('CREDIT_PROFILE_NOT_FOUND', cause);
    }
  }
}
