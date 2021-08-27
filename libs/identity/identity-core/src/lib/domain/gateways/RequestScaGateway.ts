import { Identity } from '../entities/Identity';
import { ScaVerifier } from '../types/ScaVerifier';

export interface RequestScaGateway {
  requestSca(
    identity: Identity,
    request: {
      type: string;
      payload: string;
    },
  ): Promise<ScaVerifier>;
}
