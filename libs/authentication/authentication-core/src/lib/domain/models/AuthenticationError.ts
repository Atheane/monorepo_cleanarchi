import { DomainError } from '@oney/common-core';
import { DefaultDomainErrorMessages, DefaultUiErrorMessages } from './AuthenticationErrorMessage';
import { RefAuthResponseReturnTypeCodes } from '../../usecases/healthcheck/PingRefAuth';
import { UserProperties } from '../aggregates/User';

export enum AuthResponseReturnTypeCodes {
  AUTH_INIT = 'AUTH_INIT',
  AUTH_VERIFY = 'AUTH_VERIFY',
  REFAUTH = 'REFAUTH',
}

export interface ProvisioningErrorCauseUserProps {
  uid: string;
  email: string;
  phoneNumber?: string;
}
export interface ProvisioningErrorCause<T extends DefaultUiErrorMessages = DefaultUiErrorMessages> {
  msg: T;
  uid?: string;
  userProps: ProvisioningErrorCauseUserProps;
  responseCode: RefAuthResponseReturnTypeCodes | string;
}

export function sanitizeErrorMessage(message: DefaultDomainErrorMessages | string) {
  let safeMessage: string;
  for (const key in AuthResponseReturnTypeCodes) {
    /* istanbul ignore else  */
    if (Object.prototype.hasOwnProperty.call(AuthResponseReturnTypeCodes, key)) {
      const prefix = AuthResponseReturnTypeCodes[key];
      if (message.includes(prefix)) {
        safeMessage = message.replace(`${prefix}_`, '');
        break;
      }
    }
  }
  return safeMessage ?? message;
}

export namespace PingIcgError {
  export class IcgPingFailed extends DomainError {}
}

export namespace UserError {
  export class UserNotFound extends DomainError {}
  export class NonValidDigitPinCode extends DomainError {}
  export class EmptyDeviceIdOrPinCodeValue extends DomainError {}
  export class PinCodeNotSet extends DomainError {}
  export class PasswordNotValid extends DomainError {}
  export class InvalidEmail extends DomainError {
    code: DefaultDomainErrorMessages.INVALID_EMAIL_ADDRESS;
  }
  export class InvalidPhoneNumber extends DomainError {
    code: DefaultDomainErrorMessages.INVALID_PHONE_NUMBER;
  }
}

export namespace AuthenticationError {
  export class VerifierNotFound extends DomainError {}
  export class BadCredentials extends DomainError {
    constructor(message = DefaultDomainErrorMessages.BAD_CREDENTIALS as const, cause?: unknown) {
      super(message, cause, sanitizeErrorMessage(message));
    }
  }
  export class AuthInitNoRedirect extends DomainError {}
  export class AuthInitRedirectToErrorPage extends DomainError {}
  export class AuthInitSamlRequestFail extends DomainError {}
  export class AuthInitFollowRedirectFail extends DomainError {}
  export class AuthInitTooManyAuthSessionsForUser extends DomainError {
    constructor(uid: string) {
      const message = DefaultDomainErrorMessages.AUTH_INIT_TOO_MANY_ACTIVE_AUTH_SESSIONS_FOR_USER as const;
      const cause = {
        uid,
        msg: DefaultUiErrorMessages.AUTH_INIT_TOO_MANY_ACTIVE_AUTH_SESSIONS_FOR_USER,
      };

      super(message, cause, sanitizeErrorMessage(message));
    }
  }
  export class AuthInitUnknownUser extends DomainError {
    constructor(uid: string) {
      const message = DefaultDomainErrorMessages.AUTH_INIT_UNKNOWN_USER as const;
      const cause = {
        uid,
        msg: DefaultUiErrorMessages.AUTH_INIT_UNKNOWN_USER,
      };

      super(message, cause, sanitizeErrorMessage(message));
    }
  }
  export class AuthInitUnknownIcgValidationMethodType extends DomainError {}
  export class AuthInitAuthenticationFailedSmsProviderError extends DomainError {
    constructor(uid: string) {
      const message = DefaultDomainErrorMessages.AUTH_INIT_AUTHENTICATION_FAILED_SMS_PROVIDER_ERROR;
      const cause = {
        uid,
        msg: DefaultUiErrorMessages.AUTH_INIT_AUTHENTICATION_FAILED_SMS_PROVIDER_ERROR,
      };

      super(message, cause, sanitizeErrorMessage(message));
    }
  }
  export class AuthInitAuthenticationFailed extends DomainError {
    constructor(uid: string) {
      const message = DefaultDomainErrorMessages.AUTH_INIT_AUTHENTICATION_FAILED;
      const cause = {
        uid,
        msg: DefaultUiErrorMessages.AUTH_INIT_AUTHENTICATION_FAILED,
      };

      super(message, cause, sanitizeErrorMessage(message));
    }
  }
  export class AuthInitAuthenticationLocked extends DomainError {
    constructor(uid: string, unlockingDate: Date) {
      const message = DefaultDomainErrorMessages.AUTH_INIT_AUTHENTICATION_LOCKED;
      const cause = {
        uid,
        msg: DefaultUiErrorMessages.AUTH_INIT_AUTHENTICATION_LOCKED,
        unblockingDate: unlockingDate,
      };

      super(message, cause, sanitizeErrorMessage(message));
    }
  }
  export class AuthVerifyFail extends DomainError {}
  export class AuthVerifyMalformedResponse extends DomainError {}
  export class AccountBlocked extends DomainError {}
  export class SecurityAssertionSignatureVerificationFailed extends DomainError {
    safeMessage = DefaultUiErrorMessages.SECURITY_ASSERTION_SIGNATURE_VERIFICATION_FAILED;
  }
  export class UnknownAuthenticationFactor extends DomainError {}
  export class SecurityAssertionInvalidSignature extends DomainError {
    safeMessage = DefaultUiErrorMessages.SECURITY_ASSERTION_INVALID_SIGNATURE;
  }
}

export namespace VerifierError {
  export class MethodNonImplemented extends DomainError {}
}

export namespace RegisterCreateError {
  export class UserAlreadyExist extends DomainError {}
  export class PhoneNotVerified extends DomainError {}
}

export namespace RegisterValidateError {
  export class InvitationDoesNotExist extends DomainError {}
  export class InvitationExpired extends DomainError {}
  export class InvitationAlreadyCompleted extends DomainError {}
  export class InvitationNotCompleted extends DomainError {}
}

export namespace RefAuthError {
  export class ProvisionClientRequestFail extends DomainError {}
  export class ProvisionClientFailWithUnknownCode extends DomainError {
    constructor(
      uid: string,
      unknownCode: string,
      message = DefaultDomainErrorMessages.REFAUTH_PROVISION_CLIENT_FAIL_WITH_UNKNOWN_CODE as const,
      cause?: ProvisioningErrorCause<DefaultUiErrorMessages.REFAUTH_PROVISION_CLIENT_FAIL_WITH_UNKNOWN_CODE>,
    ) {
      // eslint-disable-next-line no-param-reassign
      cause = {
        msg: `${DefaultUiErrorMessages.REFAUTH_PROVISION_CLIENT_FAIL_WITH_UNKNOWN_CODE}: ${unknownCode}`,
        uid,
        ...cause,
        responseCode: unknownCode,
      };
      super(`${message}: ${message}`, cause, sanitizeErrorMessage(message));
    }
  }
  export class ProvisionClientFailWithAlert extends DomainError {
    constructor(
      uid: string,
      message = DefaultDomainErrorMessages.REFAUTH_PROVISION_CLIENT_FAIL_WITH_ALERT as const,
      cause?: ProvisioningErrorCause<DefaultUiErrorMessages.REFAUTH_PROVISION_CLIENT_FAIL_WITH_ALERT>,
    ) {
      // eslint-disable-next-line no-param-reassign
      cause = {
        msg: DefaultUiErrorMessages.REFAUTH_PROVISION_CLIENT_FAIL_WITH_ALERT,
        uid,
        ...cause,
        responseCode: RefAuthResponseReturnTypeCodes.ALERT,
      };
      super(message, cause, sanitizeErrorMessage(message));
    }
  }
  export class ProvisionClientFailWithTechnicalError extends DomainError {
    constructor(
      uid: string,
      message = DefaultDomainErrorMessages.REFAUTH_PROVISION_CLIENT_FAIL_WITH_TECHNICAL_ERROR as const,
      cause?: ProvisioningErrorCause<
        DefaultUiErrorMessages.REFAUTH_PROVISION_CLIENT_FAIL_WITH_TECHNICAL_ERROR
      >,
    ) {
      // eslint-disable-next-line no-param-reassign
      cause = {
        msg: DefaultUiErrorMessages.REFAUTH_PROVISION_CLIENT_FAIL_WITH_TECHNICAL_ERROR,
        uid,
        ...cause,
        responseCode: RefAuthResponseReturnTypeCodes.TECHNICAL_ERROR,
      };
      super(message, cause, sanitizeErrorMessage(message));
    }
  }
  export class ProvisionClientFailWithRequestError extends DomainError {
    constructor(
      uid: string,
      message = DefaultDomainErrorMessages.REFAUTH_PROVISION_CLIENT_FAIL_WITH_REQUEST_ERROR as const,
      cause?: ProvisioningErrorCause<DefaultUiErrorMessages.REFAUTH_PROVISION_CLIENT_FAIL_WITH_REQUEST_ERROR>,
    ) {
      // eslint-disable-next-line no-param-reassign
      cause = {
        msg: DefaultUiErrorMessages.REFAUTH_PROVISION_CLIENT_FAIL_WITH_REQUEST_ERROR,
        uid,
        ...cause,
        responseCode: RefAuthResponseReturnTypeCodes.REQUEST_ERROR,
      };
      super(message, cause, sanitizeErrorMessage(message));
    }
  }
  export class ProvisioningClientFailWithContractExecutionError extends DomainError {
    constructor(
      uid: string,
      message = DefaultDomainErrorMessages.REFAUTH_PROVISION_CLIENT_FAIL_WITH_CONTRACT_EXECUTION_ERROR as const,
      cause?: ProvisioningErrorCause<
        DefaultUiErrorMessages.REFAUTH_PROVISION_CLIENT_FAIL_WITH_CONTRACT_EXECUTION_ERROR
      >,
    ) {
      // eslint-disable-next-line no-param-reassign
      cause = {
        msg: DefaultUiErrorMessages.REFAUTH_PROVISION_CLIENT_FAIL_WITH_CONTRACT_EXECUTION_ERROR,
        uid,
        ...cause,
        responseCode: RefAuthResponseReturnTypeCodes.CONTRACT_EXECUTION_ERROR,
      };
      super(message, cause, sanitizeErrorMessage(message));
    }
  }
  export class ProvisionFailWithCardDataDecryptionError extends DomainError {
    constructor(
      { uid, email, metadata }: UserProperties,
      customMessage: string,
      defaultMessage = DefaultDomainErrorMessages.REFAUTH_PROVISION_FAIL_WITH_CARD_DATA_DECRYPTION_ERROR as const,
      cause?: ProvisioningErrorCause<
        DefaultUiErrorMessages.REFAUTH_PROVISION_FAIL_WITH_CARD_DATA_DECRYPTION_ERROR
      >,
    ) {
      const msg = `${DefaultUiErrorMessages.REFAUTH_PROVISION_FAIL_WITH_CARD_DATA_DECRYPTION_ERROR}: ${customMessage}`;
      const enrichedCause = {
        uid,
        msg,
        ...cause,
        userProps: {
          uid,
          email: email.address,
          phoneNumber: metadata?.phone,
        },
      };
      super(defaultMessage, enrichedCause, sanitizeErrorMessage(defaultMessage));
    }
  }
  export class ProvisionFailTransientError extends DomainError {
    constructor(
      { uid, email, metadata }: UserProperties,
      customMessage: string,
      defaultMessage = DefaultDomainErrorMessages.REFAUTH_PROVISION_FAIL_TRANSIENT_ERROR as const,
      cause?: ProvisioningErrorCause<DefaultUiErrorMessages.REFAUTH_PROVISION_FAIL_TRANSIENT_ERROR>,
    ) {
      const msg = `${DefaultUiErrorMessages.REFAUTH_PROVISION_FAIL_TRANSIENT_ERROR}: ${customMessage}`;
      const enrichedCause = {
        uid,
        msg,
        ...cause,
        userProps: {
          uid,
          email: email.address,
          phoneNumber: metadata?.phone,
        },
      };
      super(defaultMessage, enrichedCause, sanitizeErrorMessage(defaultMessage));
    }
  }
}

export namespace EncryptionError {
  export class InvalidCardPan extends DomainError {
    code = DefaultDomainErrorMessages.INVALID_CARD_PAN;
  }
  export class EncryptionNotFound extends DomainError {}
}
