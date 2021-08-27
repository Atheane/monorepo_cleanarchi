import { DomainError } from '@oney/common-core';

export enum ProfileErrorCodes {
  MORE_THAN_MAX_AGE = 'E001_V021',
  LESS_THAN_MIN_AGE = 'E001_V022',
  BIRTHDATE_IN_FUTURE = 'E001_V023',
  UNAUTHORIZED_BIRTH_COUNTRY = 'E001_U002',
}

export namespace ProfileErrors {
  export class ProfileNotFound extends DomainError {}
  export class BankAccountIdentityError extends DomainError {}

  export class IncorrectIdentityDocumentError extends DomainError {
    constructor() {
      super('Uploaded document type is incorrect');
    }
  }

  export class UnauthorizedAge extends DomainError {
    code: ProfileErrorCodes;
    constructor(message: string, code: ProfileErrorCodes) {
      super(message);
      this.code = code;
    }
  }

  export class UnauthorizedBirthCountry extends DomainError {
    code: ProfileErrorCodes;
    constructor(message: string) {
      super(message);
      this.code = ProfileErrorCodes.UNAUTHORIZED_BIRTH_COUNTRY;
    }
  }
}
