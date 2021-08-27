import { DomainError } from '@oney/common-core';

export namespace ClientError {
  export class ClientNotFound extends DomainError {
    constructor(cause?: string | object) {
      super('CLIENT_NOT_FOUND', cause);
    }
  }
}
