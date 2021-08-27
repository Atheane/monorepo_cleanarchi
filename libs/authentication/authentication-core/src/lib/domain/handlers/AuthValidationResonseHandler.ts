import { StrongAuthVerifier } from '../entities/StrongAuthVerifier';

export interface AuthValidationResonseHandler {
  handleResponsePayload(responseBody: object, verifier: StrongAuthVerifier): Promise<StrongAuthVerifier>;
}
