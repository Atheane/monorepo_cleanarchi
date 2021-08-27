import { DomainError } from '@oney/common-core';

export namespace Error {
  export class DataNotFound extends DomainError {
    constructor(cause?: any) {
      super('DATA_NOT_FOUNS', cause);
    }
  }

  export class CompilationFailed extends DomainError {
    /* istanbul ignore next */
    constructor(cause?: any) {
      super('COMPILATION_FAILED', cause);
    }
  }
}
