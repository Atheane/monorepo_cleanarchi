import { DomainError } from '@oney/common-core';

export namespace RbacError {
  export class UserCannotRead extends DomainError {
    constructor(cause?: string | object) {
      super('USER_CANNOT_READ', cause);
    }
  }
  export class UserCannotWrite extends DomainError {
    constructor(cause?: string | object) {
      super('USER_CANNOT_WRITE', cause);
    }
  }
}
