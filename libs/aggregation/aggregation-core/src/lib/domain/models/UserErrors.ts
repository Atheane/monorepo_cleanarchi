import { DomainError } from '@oney/common-core';

export namespace UserError {
  export class UserUnknown extends DomainError {
    constructor(cause?: string | object) {
      super('USER_UNKNOWN', cause);
    }
  }
  export class UserAlreadyExists extends DomainError {
    constructor(cause?: any) {
      super('USER_ALREADY_EXISTS', cause);
    }
  }
  export class ApiResponseError extends DomainError {
    constructor(cause?: string | object) {
      super('API_RESPONSE_ERROR', cause);
    }
  }
}
