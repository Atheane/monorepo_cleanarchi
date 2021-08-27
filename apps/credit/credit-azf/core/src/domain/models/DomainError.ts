/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export class DomainError extends Error {
  code: string;

  cause?: any;

  constructor(message: string, cause?: any) {
    super(message);
    this.name = this.constructor.name;
    this.code = this.message;
    this.cause = cause;
  }
}

export namespace SplitContractError {
  export class NotFound extends DomainError {
    constructor(cause?: any) {
      super('SPLIT_CONTRACT_NOT_FOUND', cause);
    }
  }
}
