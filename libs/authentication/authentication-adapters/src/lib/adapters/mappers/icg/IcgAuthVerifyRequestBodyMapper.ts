import { AuthRequestPayload, AuthRequestValidationMethod } from '@oney/authentication-core';
import { Mapper } from '@oney/common-core';
import { ValidationMethodType } from '../../types/icg/ValidationMethodType';
import { VerifyRequestPayloadConfig } from '../../types/icg/VerifyRequestPayloadConfig';

export interface InputExtract {
  method: AuthRequestValidationMethod;
  validationUnitId: string;
  credential: string;
}

export class IcgAuthVerifyRequestBodyMapper implements Mapper<AuthRequestPayload> {
  toDomain(raw: VerifyRequestPayloadConfig): AuthRequestPayload {
    if (this._isSmsAuthValidation(raw)) return this._getOtpSmsVerifyRequestPayload(raw);
    else return this._getCloudcardVerifyRequestPayload(raw);
  }

  private _isSmsAuthValidation(raw: VerifyRequestPayloadConfig): boolean {
    return raw.data.method.type === ValidationMethodType.SMS;
  }

  private _getCloudcardVerifyRequestPayload(raw: VerifyRequestPayloadConfig): AuthRequestPayload {
    const { method, validationUnitId } = this._extractFromInput(raw);
    const validationMethod = { type: method.type, id: method.id };
    return { validate: { [validationUnitId]: [validationMethod] } };
  }

  private _getOtpSmsVerifyRequestPayload(raw: VerifyRequestPayloadConfig): AuthRequestPayload {
    const { method, validationUnitId, credential } = this._extractFromInput(raw);
    const validationMethod = { type: method.type, id: method.id, otp_sms: credential };
    return { validate: { [validationUnitId]: [validationMethod] } };
  }

  private _extractFromInput({ data, credential }: VerifyRequestPayloadConfig): InputExtract {
    const { method, id: validationUnitId } = data;
    return { method, validationUnitId, credential };
  }
}
