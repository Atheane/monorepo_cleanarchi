import { OtpSmsAuthMethod, PinAuthMethod } from '@oney/authentication-core';
import { AuthInitDto } from './AuthInitDto';

export type StrongAuthVerifierMetadata<M = OtpSmsAuthMethod | PinAuthMethod> = {
  icgAuthInitResult: AuthInitDto<M>;
  icgAuthInitSession: string[];
};
