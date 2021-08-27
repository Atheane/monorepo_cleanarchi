import { AuthRequestValidationMethod } from './AuthRequestValidationMethod';

export interface AuthRequestPayload {
  validate: {
    [validationUnitId: string]: AuthRequestValidationMethod[];
  };
}
