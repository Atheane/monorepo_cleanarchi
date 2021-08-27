import { DomainError } from '@oney/common-core';

export namespace CdpEventError {
  export class InvalidPayload extends DomainError {
    constructor(cause?: string | object) {
      super('INVALID_PAYLOAD', cause);
    }
  }
  export class MissingEventName extends DomainError {
    constructor(cause?: string | object) {
      super('MISSING_EVENT_NAME', cause);
    }
  }
  export class EventNotImplemented extends DomainError {
    constructor(cause?: string | object) {
      super('EVENT_NOT_IMPLEMENTED', cause);
    }
  }
}
