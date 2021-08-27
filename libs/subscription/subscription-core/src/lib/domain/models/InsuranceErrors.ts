import { DomainError } from '@oney/common-core';

export namespace InsuranceErrors {
  export class OfferNotAvailable extends DomainError {}
  export class HonorificCodeNotHandle extends DomainError {}
}

export namespace NetworkError {
  export class ApiResponseError extends DomainError {}
}
