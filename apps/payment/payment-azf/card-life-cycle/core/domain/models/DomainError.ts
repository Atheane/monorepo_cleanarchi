import { DomainError } from '@oney/common-core';

export enum ErrorMessages {
  CALLBACK_PAYLOAD_NOT_FOUND = 'CALLBACK_PAYLOAD_NOT_FOUND: $@',
  CALLBACK_PAYLOAD_SAVE_FAILED = 'CALLBACK_PAYLOAD_SAVE_FAILED: $@',
}

export namespace CardLifecycleCallbackError {
  export class PayloadNotFound extends DomainError {}
  export class RelatedBankAccountNotFound extends DomainError {}
}
