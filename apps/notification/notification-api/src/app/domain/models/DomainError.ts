import { DomainError } from '@oney/common-core';

enum ErrorMessages {
  RECIPIENT_NOT_FOUND = 'RECIPIENT_NOT_FOUND',
}

export namespace RecipientError {
  export class RecipientNotFound extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.RECIPIENT_NOT_FOUND, cause);
    }
  }
}
