import { OtpGenerator } from '@oney/authentication-core';
import { injectable } from 'inversify';

@injectable()
export class OtpCodeGenerator implements OtpGenerator {
  generateOTP(): string {
    return '00000000';
  }
}
