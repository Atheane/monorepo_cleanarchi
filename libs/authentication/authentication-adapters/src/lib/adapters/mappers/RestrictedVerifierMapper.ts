import {
  AuthFactor,
  AuthStatus,
  Channel,
  OtpSmsAuthMethod,
  StrongAuthVerifier,
} from '@oney/authentication-core';
import { Mapper } from '@oney/common-core';
import { injectable } from 'inversify';
import { StrongAuthVerifierMetadata } from '../types/icg/StrongAuthVerifierMetadata';

export type AttemptMetadatas = {
  otpLength?: number;
  retries?: number;
  unblockingDate?: Date;
};

const getStatus = (authStatus: AuthStatus): string => {
  const status = { [AuthStatus.EXPIRED]: 'TOKEN_EXPIRED' };
  return status[authStatus] ?? '2FA_REQUESTED';
};

@injectable()
export class RestrictedVerifierMapper
  implements
    Mapper<
      StrongAuthVerifier<AttemptMetadatas>,
      Partial<StrongAuthVerifier<AttemptMetadatas>> & { code: string }
    > {
  fromDomain(raw: StrongAuthVerifier<any>): Partial<StrongAuthVerifier<AttemptMetadatas>> & { code: string } {
    const { status, valid, factor, channel, action, verifierId, customer, expirationDate } = raw;
    const attemptMetadatas: AttemptMetadatas = {};
    if (this._isOtpSms(raw)) this._setMetadataForOtpSms(attemptMetadatas, raw);
    if (this._isIcgVerifier(raw)) this._setMetadatasForIcgVerifier(attemptMetadatas, raw);

    return {
      verifierId,
      action,
      customer,
      status,
      valid,
      factor,
      channel,
      expirationDate,
      metadatas: attemptMetadatas,
      code: getStatus(status),
    };
  }

  private _setMetadatasForIcgVerifier(attemptMetadatas: AttemptMetadatas, raw: StrongAuthVerifier<any>) {
    if (this._verifierIsNotDone(raw)) {
      if (this._verifierHasRetries(raw)) this._setRetries(attemptMetadatas, raw);
      if (this._verifierIsBlocked(raw)) this._setUnblockingDate(attemptMetadatas, raw);
    }
  }

  private _setUnblockingDate(attemptMetadatas: AttemptMetadatas, raw: StrongAuthVerifier<any>) {
    const { unblockingDate } = raw.metadatas.icgAuthInitResult;
    attemptMetadatas.unblockingDate = unblockingDate;
  }

  private _setRetries(attemptMetadatas: AttemptMetadatas, raw: StrongAuthVerifier<any>) {
    const { retries } = raw.metadatas.icgAuthInitResult;
    attemptMetadatas.retries = retries;
  }

  private _verifierHasRetries(raw: StrongAuthVerifier<any>): boolean {
    const { retries } = raw.metadatas.icgAuthInitResult;
    return !!retries;
  }

  private _verifierIsBlocked(raw: StrongAuthVerifier<any>): boolean {
    return raw.status == AuthStatus.BLOCKED;
  }

  private _verifierIsNotDone(raw: StrongAuthVerifier<any>): boolean {
    return raw.status != AuthStatus.DONE;
  }

  private _setMetadataForOtpSms(attemptMetadatas: AttemptMetadatas, raw: StrongAuthVerifier<any>) {
    if (this._isIcgVerifier(raw)) {
      attemptMetadatas.otpLength = ((raw.metadatas as unknown) as StrongAuthVerifierMetadata<
        OtpSmsAuthMethod
      >).icgAuthInitResult.method.maxSize;
    } else {
      attemptMetadatas.otpLength = raw.credential?.length || 8;
    }
  }

  private _isOtpSms(raw: StrongAuthVerifier<any>): boolean {
    return raw.factor == AuthFactor.OTP && raw.channel == Channel.SMS;
  }

  private _isIcgVerifier(raw: StrongAuthVerifier<any>): boolean {
    return raw.metadatas && raw.metadatas.icgAuthInitResult != null;
  }
}
