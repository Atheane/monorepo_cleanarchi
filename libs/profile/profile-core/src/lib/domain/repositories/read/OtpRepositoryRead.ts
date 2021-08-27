import { Otp } from '../../aggregates/Otp';

export interface OtpRepositoryRead {
  getOtpByUid(uid: string): Promise<Otp>;
}
