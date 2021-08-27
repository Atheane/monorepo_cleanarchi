import {
  AuthenticationError,
  AuthFactor,
  AuthStatus,
  Channel,
  Customer,
  DefaultDomainErrorMessages,
  OtpSmsAuthMethod,
  PinAuthMethod,
  StrongAuthVerifier,
  VerifierGenerator,
  VerifierContext,
} from '@oney/authentication-core';
import { injectable } from 'inversify';
import { AuthInitDto } from '../../types/icg/AuthInitDto';
import { StrongAuthVerifierMetadata } from '../../types/icg/StrongAuthVerifierMetadata';
import { ValidationMethodType } from '../../types/icg/ValidationMethodType';

interface AuthMethodContext {
  authFactor: AuthFactor;
  channel: Channel;
}

interface AuthMetadataContext {
  icgAuthInitResult: AuthInitDto<OtpSmsAuthMethod | PinAuthMethod>;
  icgAuthInitSession;
  channel: Channel;
  authFactor: AuthFactor;
}

@injectable()
export class IcgVerifierGenerator implements VerifierGenerator<{ cookies: string[] }> {
  async generateVerifier(
    verifierContext: VerifierContext<{ cookies: string[] }, AuthInitDto<OtpSmsAuthMethod | PinAuthMethod>>,
  ): Promise<StrongAuthVerifier<StrongAuthVerifierMetadata>> {
    const { user, action, result: icgAuthInitResult, cookies: icgAuthInitSession } = verifierContext;
    const { uid, email } = user.props;
    const { responseId, method } = icgAuthInitResult;
    const { authFactor, channel } = this._getAuthMethodContext(method.type);
    const authMetadataContext = { icgAuthInitResult, icgAuthInitSession, authFactor, channel };
    return new StrongAuthVerifier<StrongAuthVerifierMetadata>({
      // the verifierId is internal to ODB, can be any arbitrary uid, here we use response ID (containing "CtxDACS...")
      verifierId: responseId,
      factor: authFactor,
      expirationDate: this._setExpirationDate(),
      valid: false,
      status: AuthStatus.PENDING,
      credential: null,
      action,
      channel,
      customer: new Customer({
        uid,
        email: email.address,
      }),
      metadatas: this._setMetadata(authMetadataContext),
    });
  }

  private _getAuthMethodContext(authMethodType: string): AuthMethodContext {
    switch (authMethodType) {
      case ValidationMethodType.SMS: {
        return { authFactor: AuthFactor.OTP, channel: Channel.SMS };
      }

      case ValidationMethodType.PIN_AUTH: {
        // TODO: to be modelised as a notification
        return { authFactor: AuthFactor.CLOUDCARD, channel: null };
      }

      default: {
        throw new AuthenticationError.AuthInitUnknownIcgValidationMethodType(
          DefaultDomainErrorMessages.AUTH_INIT_UNKNOWN_ICG_VALIDATION_METHOD_TYPE,
        );
      }
    }
  }

  private _setExpirationDate(): Date {
    const expirationDation = new Date();
    const ttl = 20;
    expirationDation.setMinutes(expirationDation.getMinutes() + ttl);
    return expirationDation;
  }

  private _setMetadata(authMetadataContext: AuthMetadataContext): StrongAuthVerifierMetadata {
    const isOtpSms =
      authMetadataContext.channel === Channel.SMS && authMetadataContext.authFactor === AuthFactor.OTP;
    return {
      icgAuthInitResult: authMetadataContext.icgAuthInitResult,
      icgAuthInitSession: authMetadataContext.icgAuthInitSession,
      ...(isOtpSms && {
        otpLength: (authMetadataContext.icgAuthInitResult as AuthInitDto<OtpSmsAuthMethod>).method.maxSize,
      }),
    };
  }
}
