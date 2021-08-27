import { Otp } from '@oney/profile-core';

export interface OtpGateway {
  isExpired(otp: Otp): boolean;

  isValid(otp: Otp, requestedOtp: string): boolean;

  generateCode(): string;

  generateCodeHash(code: string): string;

  isMaxAttemptsExceeded(otp: Otp): boolean;

  isLockDurationElapsed(otp: Otp): boolean;
}
