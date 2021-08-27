import { DomainError } from '@oney/common-core';

export namespace ScaErrors {
  export class ScaVerifierActionAlreadyConsumed extends DomainError {}
  export class ScaVerifierNotValid extends DomainError {}
  export class ScaDefaultVerifierError extends DomainError {}
  export class ScaRequired extends DomainError {}
  export class ScaRequestError extends DomainError {}
}
