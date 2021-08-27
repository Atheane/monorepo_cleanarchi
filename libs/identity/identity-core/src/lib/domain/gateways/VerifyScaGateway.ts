import { ScaVerifier } from '../types/ScaVerifier';
import { VerifyScaPayload } from '../types/VerifyScaPayload';

export interface VerifyScaGateway {
  verify(verifyScaPayload: VerifyScaPayload): Promise<ScaVerifier>;
}
