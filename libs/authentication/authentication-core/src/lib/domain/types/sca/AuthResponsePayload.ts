import { AuthInnerResponse } from './AuthInnerResponse';
import { AuthResponseContext } from './AuthResponseContext';
import { AuthResponsePhase } from './AuthResponsePhase';
import { OtpSmsAuthMethod } from './AuthValidationMethod';
import { AuthValidationStep } from './AuthValidationStep';
import { AuthValidationUnit } from './AuthValidationUnit';

export interface AuthResponsePayload<T> {
  id?: string;
  locale?: string;
  context?: AuthResponseContext;
  response?: AuthInnerResponse<T>;
  step?: AuthValidationStep;
  phase?: Required<AuthResponsePhase>;
  validationUnits?: AuthValidationUnit<OtpSmsAuthMethod>[];
}
