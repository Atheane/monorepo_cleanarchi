import {
  AuthenticationError,
  AuthResponsePayload,
  InnerResponseStatus,
  OtpSmsAuthMethod,
  PinAuthMethod,
} from '@oney/authentication-core';
import { Mapper } from '@oney/common-core';
import { injectable } from 'inversify';
import { AuthInitDto } from '../../types/icg/AuthInitDto';
import { AuthInitResultMapperInput } from '../../types/icg/AuthInitResultMapperInput';
import { AuthInitResponseDataExtract } from '../../types/icg/AuthInitResponseDataExtract';
import { AuthResponseErrorStatusMessage } from '../../types/icg/AuthResponseErrorStatusMessage';
import { SamlResponse } from '../../types/icg/SamlResponse';

@injectable()
export class AuthInitResultMapper implements Mapper<AuthInitDto<OtpSmsAuthMethod | PinAuthMethod>> {
  toDomain(raw: AuthInitResultMapperInput): AuthInitDto<OtpSmsAuthMethod | PinAuthMethod> {
    if (this._authenticationHasFailed(raw)) throw this._handleFailedAuthentication(raw);
    if (this._authenticationIsLocked(raw)) throw this._handleLockedAuthentication(raw);
    return this._handleSuccessAuthentication(raw);
  }

  private _authenticationHasFailed({ result }: AuthInitResultMapperInput): boolean {
    return !result.step && result.response.status === InnerResponseStatus.INIT_FAILED;
  }

  private _authenticationIsLocked({ result }: AuthInitResultMapperInput): boolean {
    return !result.step && result.response.status === InnerResponseStatus.LOCKED;
  }

  private _handleFailedAuthentication(raw: AuthInitResultMapperInput): never {
    const decodedSamlResponse = this._decodeFailedSamlResponse(raw);
    const errorMsg = this._extractErrorStatusMessage(decodedSamlResponse);
    throw this._throwFailedAuthInitError(errorMsg, raw);
  }

  private _decodeFailedSamlResponse({ result }: AuthInitResultMapperInput): string {
    const { samlResponse: sr64 } = result.response.saml2_post;
    const decodedSamlResponse = Buffer.from(sr64, 'base64').toString('utf-8');
    return decodedSamlResponse;
  }

  private _extractErrorStatusMessage(samlDoc: string): string {
    const errorStatusPattern = /<saml2p:StatusMessage>(\w+)<\/saml2p:StatusMessage>/;
    const match = samlDoc.match(errorStatusPattern);
    return match[1];
  }

  private _throwFailedAuthInitError(errorMsg: string, { uid }: AuthInitResultMapperInput): never {
    if (errorMsg === AuthResponseErrorStatusMessage.SMS_PROVIDER)
      throw new AuthenticationError.AuthInitAuthenticationFailedSmsProviderError(uid);
    else throw new AuthenticationError.AuthInitAuthenticationFailed(uid);
  }

  private _handleLockedAuthentication({ uid }: AuthInitResultMapperInput): Promise<never> {
    throw new AuthenticationError.AuthInitAuthenticationLocked(uid, null);
  }

  private _handleSuccessAuthentication({
    result,
  }: AuthInitResultMapperInput): AuthInitDto<OtpSmsAuthMethod | PinAuthMethod> {
    const extract = this._extracAuthtResponseData(result);
    return this._mapAuthResponseExtractionToDomain(extract);
  }

  private _extracAuthtResponseData(result: AuthResponsePayload<SamlResponse>): AuthInitResponseDataExtract {
    const { validationUnits } = result.step;
    const [validationUnit] = validationUnits;
    const [validationUnitId] = Object.keys(validationUnit);
    const [validationMethod] = validationUnit[validationUnitId];
    return { responseId: result.id, validationUnitId, validationMethod };
  }

  private _mapAuthResponseExtractionToDomain(
    extract: AuthInitResponseDataExtract,
  ): AuthInitDto<OtpSmsAuthMethod | PinAuthMethod> {
    return {
      responseId: extract.responseId,
      id: extract.validationUnitId,
      method: { ...extract.validationMethod },
    };
  }
}
