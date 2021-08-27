import { AuthValidationMethod } from './AuthValidationMethod';

export interface AuthRequestValidationMethod extends AuthValidationMethod {
  otp_sms?: string;
}
