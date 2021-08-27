import { Identity } from '../entities/Identity';

export interface IdentityEncoder {
  encode(payload: Identity): Promise<string>;
}
