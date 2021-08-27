import { Otp } from '../../aggregates/Otp';

export interface OtpRepositoryWrite {
  delete(otp: Otp): Promise<void>;
  save(otp: Otp): Promise<Otp>;
}
