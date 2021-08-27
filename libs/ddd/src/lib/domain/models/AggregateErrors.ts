import { DomainError } from '@oney/common-core';

export namespace AggregateErrors {
  export class MissingHandleDecorator extends DomainError {}
}
