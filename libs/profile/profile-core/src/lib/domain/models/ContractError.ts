import { DomainError } from '@oney/common-core';

export namespace ContractErrors {
  export class ContractSigned extends DomainError {
    constructor(cause?: any) {
      super('CONTRACT_SIGNED', cause);
    }
  }
}
