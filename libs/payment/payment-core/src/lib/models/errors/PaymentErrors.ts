import { DomainError } from '@oney/common-core';

export enum ErrorMessages {
  CALLBACK_PAYLOAD_NOT_FOUND = 'CALLBACK_PAYLOAD_NOT_FOUND',
  CALLBACK_NOT_SUPPORTED = 'CALLBACK_NOT_SUPPORTED',
  INVALID_CALLBACK_PAYLOAD = 'INVALID_CALLBACK_PAYLOAD',
  INVALID_PARAMETERS = 'INVALID_PARAMETERS',
  EXPOSURE_SYNC_FAILURE = 'EXPOSURE_SYNC_FAILURE',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  NOT_AUTHORIZED = 'NOT_AUTHORIZED',
  INVALID_BENEFICIARY = 'INVALID_BENEFICIARY',
  NON_BANK_CUSTOMER_OPERATIONS_LIMITS_REACHED = 'NON_BANK_CUSTOMER_OPERATIONS_LIMITS_REACHED',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  CANT_SEND_TO_YOURSELF = 'CANT_SEND_TO_YOURSELF',
  SENDER_CANT_CREATE_P2P = 'SENDER_CANT_CREATE_P2P',
  SENDER_ACCOUNT_BLOCKED = 'SENDER_ACCOUNT_BLOCKED',
  SENDER_DOES_NOT_EXIST = 'SENDER_DOES_NOT_EXIST',
  BAD_PARAMETERS = 'BAD_PARAMETERS',
  MISSING_PARAMETERS = 'MISSING_PARAMETERS',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INCOMPLETE_BENEFICIARY = 'INCOMPLETE_BENEFICIARY',
  ANNUAL_LIMIT_REACHED = 'ANNUAL_LIMIT_REACHED',
  CUSTOMER_OPERATION_LIMITS_REACHED = 'CUSTOMER_OPERATION_LIMITS_REACHED',
  P2P_ALREADY_EXISTS = 'P2P_ALREADY_EXISTS',
  UNCAPPED_CUSTOMER_OPERATION_LIMITS_REACHED = 'UNCAPPED_CUSTOMER_OPERATION_LIMITS_REACHED',
  CAPPED_CUSTOMER_OPERATION_LIMITS_REACHED = 'CAPPED_CUSTOMER_OPERATION_LIMITS_REACHED',
}

export namespace TagError {
  export class TagNotFound extends DomainError {}
}

export namespace BankAccountError {
  export class BankAccountNotFound extends DomainError {}
}

export namespace PaymentError {
  export class PaymentReccurentNotValid extends DomainError {}
  export class MissingBeneficiaryId extends DomainError {}
}

export namespace NetworkError {
  export class ApiResponseError extends DomainError {}
}

export namespace DateError {
  export class InvalidDate extends DomainError {}
}

export namespace CardError {
  export class UserNotFound extends DomainError {}
  export class InvalidAtmWeeklyAllowance extends DomainError {}
  export class InvalidMonthlyAllowance extends DomainError {}
  export class CardNotFound extends DomainError {}
}

export namespace OrderCardError {
  export class OfferCantBeProcessed extends DomainError {}
}

export namespace KycError {
  export class DocumentNotFound extends DomainError {}
}

export namespace AuthenticationError {
  export class Forbidden extends DomainError {}
}

export namespace BeneficiaryError {
  export class BeneficiaryNotFound extends DomainError {}
}

export namespace DispatcherError {
  export class PayloadNotFound extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.CALLBACK_PAYLOAD_NOT_FOUND, cause);
    }
  }

  export class CallbackNotSupported extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.CALLBACK_NOT_SUPPORTED, cause);
    }
  }
}

export namespace KycCallbackError {
  export class InvalidCallbackPayload extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.INVALID_CALLBACK_PAYLOAD, cause);
    }
  }
}

export namespace DiligenceSctInCallbackError {
  export class InvalidCallbackPayload extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.INVALID_CALLBACK_PAYLOAD, cause);
    }
  }
}

export namespace SDDCallbackError {
  export class InvalidCallbackPayload extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.INVALID_CALLBACK_PAYLOAD, cause);
    }
  }
}

export namespace CardOperationCallbackError {
  export class InvalidCallbackPayload extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.INVALID_CALLBACK_PAYLOAD, cause);
    }
  }
}

export namespace ClearingBatchCallbackError {
  export class InvalidCallbackPayload extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.INVALID_CALLBACK_PAYLOAD, cause);
    }
  }
}

export namespace ValidationError {
  export class InvalidParameters extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.INVALID_PARAMETERS, cause);
    }
  }
}
export namespace ExposureError {
  export class ExposureSyncFailure extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.EXPOSURE_SYNC_FAILURE, cause);
    }
  }
}

export namespace P2PErrors {
  export class UnknownError extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.UNKNOWN_ERROR, cause);
    }
  }

  export class NotAuthorized extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.NOT_AUTHORIZED, cause);
    }
  }

  export class TokenExpired extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.TOKEN_EXPIRED, cause);
    }
  }

  export class InvalidToken extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.INVALID_TOKEN, cause);
    }
  }

  export class MissingParameters extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.MISSING_PARAMETERS, cause);
    }
  }

  export class BadParameters extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.BAD_PARAMETERS, cause);
    }
  }

  export class SenderDoesNotExist extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.SENDER_DOES_NOT_EXIST, cause);
    }
  }

  export class SenderAccountBlocked extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.SENDER_ACCOUNT_BLOCKED, cause);
    }
  }

  export class SenderCantCreateP2P extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.SENDER_CANT_CREATE_P2P, cause);
    }
  }

  export class CantSendToYourself extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.CANT_SEND_TO_YOURSELF, cause);
    }
  }

  export class InvalidBeneficiary extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.INVALID_BENEFICIARY, cause);
    }
  }

  export class InsufficientBalance extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.INSUFFICIENT_BALANCE, cause);
    }
  }

  export class NonBankCustomerOperationsLimitsReached extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.NON_BANK_CUSTOMER_OPERATIONS_LIMITS_REACHED, cause);
    }
  }

  export class CappedCustomerOperationsLimitsReached extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.CAPPED_CUSTOMER_OPERATION_LIMITS_REACHED, cause);
    }
  }

  export class UncappedCustomerOperationsLimitsReached extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.UNCAPPED_CUSTOMER_OPERATION_LIMITS_REACHED, cause);
    }
  }

  export class CustomerOperationsLimitsReached extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.CUSTOMER_OPERATION_LIMITS_REACHED, cause);
    }
  }

  export class P2PAlreadyExists extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.P2P_ALREADY_EXISTS, cause);
    }
  }

  export class AnnualLimitReached extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.ANNUAL_LIMIT_REACHED, cause);
    }
  }

  export class IncompleteBeneficiary extends DomainError {
    constructor(cause?: unknown) {
      super(ErrorMessages.INCOMPLETE_BENEFICIARY, cause);
    }
  }
}
