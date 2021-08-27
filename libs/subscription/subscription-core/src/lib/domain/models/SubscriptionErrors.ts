import { DomainError } from '@oney/common-core';

export namespace SubscriptionErrors {
  export class OfferNotFound extends DomainError {}
  export class PeriodicityInvalid extends DomainError {}
  export class SubscriptionAlreadyExist extends DomainError {}
  export class SubscriptionNotFound extends DomainError {}
  export class InvalidDiscountType extends DomainError {}
  export class SubscriptionAlreadyCancelled extends DomainError {}
  export class SubscriptionAlreadyValidated extends DomainError {}
  export class SubscriptionActivationError extends DomainError {}
}
