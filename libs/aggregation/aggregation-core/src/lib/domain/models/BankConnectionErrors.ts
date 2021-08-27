import { DomainError } from '@oney/common-core';

export namespace BankConnectionError {
  export class BankConnectionNotFound extends DomainError {
    constructor(cause?: string | object) {
      super('BANK_CONNECTION_NOT_FOUND', cause);
    }
  }
  export class WrongPassword extends DomainError {
    constructor(cause?: string | object) {
      super('WRONG_PASSWORD', cause);
    }
  }
  export class ActionNeeded extends DomainError {
    constructor(cause?: string | object) {
      super('ACTION_NEEDED', cause);
    }
  }
  export class ApiResponseError extends DomainError {
    constructor(cause?: string | object) {
      super('API_RESPONSE_ERROR', cause);
    }
  }
  export class StateUnknown extends DomainError {
    constructor(cause?: string | object) {
      super('STATE_UNKNOWN', cause);
    }
  }
  export class NoScaRequired extends DomainError {
    constructor(cause?: string | object) {
      super('NO_SCA_REQUIRED', cause);
    }
  }
  export class FieldValidationFailure extends DomainError {
    constructor(cause?: string | object) {
      super('FIELD_VALIDATION_FAILURE', cause);
    }
  }
}
