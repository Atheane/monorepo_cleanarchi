import { DomainError } from '@oney/common-core';

export namespace SubscriberErrors {
  export class SubscriberAlreadyValidated extends DomainError {}
  export class SubscriberAlreadyExist extends DomainError {}
  export class SubscriberNotFound extends DomainError {}
}
