import {
  AuthenticationError,
  AuthFactor,
  AuthStatus,
  AuthValidationResonseHandler,
  DefaultDomainErrorMessages,
  StrongAuthVerifier,
  InnerResponseStatus as ValidationStatus,
  AuthResponsePayload,
  PinAuthMethod,
  AuthIdentifier,
  AuthVerificationGateway,
  OtpSmsAuthMethod,
} from '@oney/authentication-core';
import { Logger, SymLogger } from '@oney/logger-core';
import { inject, injectable } from 'inversify';
import { SamlResponse } from '../types/icg/SamlResponse';
import { StrongAuthVerifierMetadata } from '../types/icg/StrongAuthVerifierMetadata';

@injectable()
export class IcgAuthValidationResponseHandler implements AuthValidationResonseHandler {
  constructor(
    @inject(AuthIdentifier.authVerificationGateway)
    private readonly _authVerificationGateway: AuthVerificationGateway,
    @inject(SymLogger) private readonly _logger: Logger,
    public toggleResponseSignatureVerification: boolean,
  ) {}

  public async handleResponsePayload(
    payload: AuthResponsePayload<SamlResponse>,
    verifier: StrongAuthVerifier,
  ): Promise<StrongAuthVerifier> {
    const { factor } = verifier;

    this._logger.info(`Auth response signature verification is: ${this.toggleResponseSignatureVerification}`);
    if (this.toggleResponseSignatureVerification) {
      const samlRes = payload.response?.saml2_post;
      if (samlRes)
        await this._authVerificationGateway.checkSignature(samlRes.samlResponse, verifier.customer.uid);
    }

    switch (factor) {
      case AuthFactor.OTP:
        return this._manageOtpSmsPayload(payload, verifier);

      case AuthFactor.CLOUDCARD:
        return this._manageCloudcardPayload(payload, verifier);

      default:
        throw new AuthenticationError.UnknownAuthenticationFactor(`Unknown authentication factor: ${factor}`);
    }
  }

  /////////////////////
  // OTP SMS
  /////////////////////

  private _manageOtpSmsPayload(
    payload: AuthResponsePayload<SamlResponse>,
    verifier: StrongAuthVerifier<object>,
  ): StrongAuthVerifier<object> {
    const { response, phase } = payload;
    if (response?.status === ValidationStatus.SUCCESS) return this._handleOtpSmsSuccess(verifier);
    if (phase?.previousResult === ValidationStatus.FAILED) return this._handleOtpSmsFailed(payload, verifier);
    if (response?.status === ValidationStatus.LOCKED) return this._handleOtpSmsLocked(payload, verifier);
    throw new AuthenticationError.AuthVerifyMalformedResponse(
      DefaultDomainErrorMessages.AUTH_VERIFY_MALFORMED_OTP_SMS_RESPONSE_BODY,
    );
  }

  private _handleOtpSmsSuccess(verifier: StrongAuthVerifier<object>): StrongAuthVerifier<object> {
    (verifier.metadatas as StrongAuthVerifierMetadata).icgAuthInitResult.retries = null;
    const update = { status: AuthStatus.DONE, valid: true };
    return new StrongAuthVerifier({ ...verifier, ...update });
  }

  private _handleOtpSmsFailed(
    payload: AuthResponsePayload<SamlResponse>,
    verifier: StrongAuthVerifier<object>,
  ): StrongAuthVerifier<object> {
    const { retryCounter } = payload.phase;
    const [validationUnitObj] = payload.validationUnits;
    const [validationUnitId] = Object.keys(validationUnitObj);
    const [validationMethod] = validationUnitObj[validationUnitId];
    const meta = {
      ...verifier.metadatas,
      icgAuthInitResult: {
        ...(verifier.metadatas as StrongAuthVerifierMetadata).icgAuthInitResult,
        id: validationUnitId,
        method: validationMethod,
        retries: retryCounter,
      },
    };
    const update = { status: AuthStatus.PENDING, valid: false, metadatas: meta };
    const updatedVerifier = { ...verifier, ...update } as StrongAuthVerifier<StrongAuthVerifierMetadata>;
    return new StrongAuthVerifier(updatedVerifier);
  }

  private _handleOtpSmsLocked(
    payload: AuthResponsePayload<SamlResponse>,
    verifier: StrongAuthVerifier<object>,
  ): StrongAuthVerifier<object> {
    const update = { valid: false, status: AuthStatus.FAILED };
    const updatedVerifier = { ...verifier, ...update } as StrongAuthVerifier<StrongAuthVerifierMetadata>;
    if (payload.response.unlockingDate) {
      this._handleUserLockedAfter7ConsecutiveFailedRetries(updatedVerifier, payload);
    }
    updatedVerifier.metadatas.icgAuthInitResult.retries = 0;
    return new StrongAuthVerifier(updatedVerifier);
  }

  private _handleUserLockedAfter7ConsecutiveFailedRetries(
    updatedVerifier: StrongAuthVerifier<StrongAuthVerifierMetadata<OtpSmsAuthMethod | PinAuthMethod>>,
    payload: AuthResponsePayload<SamlResponse>,
  ): void {
    updatedVerifier.metadatas.icgAuthInitResult.unblockingDate = new Date(payload.response.unlockingDate);
    updatedVerifier.status = AuthStatus.BLOCKED;
  }

  /////////////////////
  // CLOUDCARD
  /////////////////////

  private _manageCloudcardPayload(
    payload: AuthResponsePayload<SamlResponse>,
    verifier: StrongAuthVerifier<object>,
  ): StrongAuthVerifier<object> {
    const { response, phase } = payload;
    if (response?.status === ValidationStatus.SUCCESS) return this._handlePinAuthSuccess(verifier);
    if (phase?.previousResult === ValidationStatus.FAILED) return this._handlePinAuthFail(payload, verifier);
    if (response?.status === ValidationStatus.CANCELED) return this._handleRejectedClearance(verifier);
    if (response?.status === ValidationStatus.LOCKED) return this._handlePinAuthLocked(verifier);
    throw new AuthenticationError.AuthVerifyMalformedResponse(
      DefaultDomainErrorMessages.AUTH_VERIFY_MALFORMED_CLOUDCARD_RESPONSE_BODY,
    );
  }

  private _handlePinAuthSuccess(verifier: StrongAuthVerifier<object>) {
    (verifier.metadatas as StrongAuthVerifierMetadata).icgAuthInitResult.retries = null;
    return new StrongAuthVerifier({
      ...verifier,
      status: AuthStatus.DONE,
      valid: true,
    });
  }

  private _handlePinAuthFail(
    payload: AuthResponsePayload<SamlResponse>,
    verifier: StrongAuthVerifier<object>,
  ) {
    const cloudcardRetryResponseBody = payload;
    const { retryCounter } = cloudcardRetryResponseBody.phase;
    const [validationUnitObj] = cloudcardRetryResponseBody.validationUnits;
    const [validationUnitId] = Object.keys(validationUnitObj);
    const [validationMethod] = validationUnitObj[validationUnitId];
    const meta = {
      ...verifier.metadatas,
      icgAuthInitResult: {
        ...(verifier.metadatas as StrongAuthVerifierMetadata).icgAuthInitResult,
        id: validationUnitId,
        method: (validationMethod as unknown) as PinAuthMethod,
        retries: retryCounter,
      },
    };
    const update = { status: AuthStatus.PENDING, valid: false, metadatas: meta };
    const updatedVerifier = { ...verifier, ...update } as StrongAuthVerifier<StrongAuthVerifierMetadata>;
    return new StrongAuthVerifier({ ...updatedVerifier });
  }

  private _handleRejectedClearance(verifier: StrongAuthVerifier<object>) {
    (verifier.metadatas as StrongAuthVerifierMetadata).icgAuthInitResult.retries = null;
    const update = { status: AuthStatus.FAILED, valid: false };
    return new StrongAuthVerifier({ ...verifier, ...update });
  }

  private _handlePinAuthLocked(verifier: StrongAuthVerifier<object>) {
    (verifier.metadatas as StrongAuthVerifierMetadata).icgAuthInitResult.retries = null;
    const update = { status: AuthStatus.FAILED, valid: false };
    return new StrongAuthVerifier({ ...verifier, ...update });
  }
}
