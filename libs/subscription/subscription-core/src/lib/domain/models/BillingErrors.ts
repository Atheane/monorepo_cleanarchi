import { DomainError } from '@oney/common-core';

export namespace BillingErrors {
  export class AmountNegativeError extends DomainError {}
}
