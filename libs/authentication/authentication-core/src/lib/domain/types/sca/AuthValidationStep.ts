import { AuthResponsePhase } from './AuthResponsePhase';
import { OtpSmsAuthMethod, PinAuthMethod } from './AuthValidationMethod';
import { AuthValidationUnit } from './AuthValidationUnit';

export interface AuthValidationStep<T = OtpSmsAuthMethod | PinAuthMethod> {
  phase: AuthResponsePhase;
  validationUnits: AuthValidationUnit<T>[];
}
