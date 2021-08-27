import { StrongAuthVerifier } from '../entities/StrongAuthVerifier';
import { Action } from '../valueobjects/Action';

export interface ScaVerifierGateway {
  generateVerifier(userId: string, action?: Action, byPassPinCode?: boolean): Promise<StrongAuthVerifier>;
  verify(verifier: StrongAuthVerifier, credential?: string): Promise<StrongAuthVerifier>;
}
