import { DomainError } from '@oney/common-core';

enum OtpErrorCodes {
  EXPIRED = 'E001_0124',
  INVALID = 'E001_0121',
}

export namespace OtpErrors {
  export class OtpExpired extends DomainError {
    code: OtpErrorCodes;

    constructor(message: string) {
      super(message);
      this.code = OtpErrorCodes.EXPIRED;
    }
  }

  export class OtpInvalid extends DomainError {
    code: string;

    constructor(message: string) {
      super(message);
      this.code = OtpErrorCodes.INVALID;
    }
  }

  export class OtpNotFound extends DomainError {}
  export class MaxAttemptsExceeded extends DomainError {}
  export class PhoneNumberAlreadyValidated extends DomainError {}
}
