import { Otp, OtpGateway } from '@oney/profile-core';
import * as moment from 'moment';
import * as generator from 'generate-password';
import { DateTime } from 'luxon';
import * as crypto from 'crypto';

export class OdbOtpGateway implements OtpGateway {
  constructor(
    private readonly _otpExpirationTime: number,
    private readonly _featureDevFlag: boolean,
    private readonly _otpMaxAttempts: number,
    private readonly _otpLockDuration: number,
  ) {}

  isExpired(otp: Otp): boolean {
    return moment(otp.props.createdAt).isBefore(moment().subtract(this._otpExpirationTime, 'minutes'));
  }

  isValid(otp: Otp, requestedOtp: string): boolean {
    const codeHash = crypto.createHash('sha1').update(requestedOtp).digest('hex');

    // istanbul ignore else : the else case is not important as we already test both generic and non generic otp
    if (this._featureDevFlag) {
      const defaultHash = crypto.createHash('sha1').update('123456').digest('hex');
      if (codeHash === defaultHash) {
        return true;
      }
    }

    return codeHash === otp.props.codeHash;
  }

  generateCode(): string {
    return generator.generate({
      length: 6,
      numbers: true,
      symbols: false,
      lowercase: false,
      excludeSimilarCharacters: false,
      strict: false,
      uppercase: false,
    });
  }

  generateCodeHash(code: string): string {
    return crypto.createHash('sha1').update(code).digest('hex');
  }

  isMaxAttemptsExceeded(otp: Otp): boolean {
    return otp.props.creationAttempts >= this._otpMaxAttempts;
  }

  isLockDurationElapsed(otp: Otp): boolean {
    return DateTime.now() > DateTime.fromISO(otp.props.updatedAt).plus({ hours: this._otpLockDuration });
  }
}
