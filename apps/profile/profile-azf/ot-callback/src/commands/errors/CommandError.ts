import { DomainError } from '@oney/common-core';

export namespace CommandError {
  export class InvalidBody extends DomainError {}
}
