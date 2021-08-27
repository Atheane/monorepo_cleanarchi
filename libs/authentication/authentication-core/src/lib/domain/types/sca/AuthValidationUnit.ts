import { OtpSmsAuthMethod, PinAuthMethod } from './AuthValidationMethod';

export interface AuthValidationUnit<T = OtpSmsAuthMethod | PinAuthMethod> {
  [validationUnitId: string]: T[];
}
