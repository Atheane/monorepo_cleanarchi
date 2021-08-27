import { DomainError } from '@oney/common-core';

export namespace TermsError {
  export class DocumentNotFound extends DomainError {
    constructor(cause?: any) {
      super('DOCUMENT_NOT_FOUND', cause);
    }
  }
}
