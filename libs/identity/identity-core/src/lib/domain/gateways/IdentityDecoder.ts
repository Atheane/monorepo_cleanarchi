import { Identity } from '../entities/Identity';

export interface IdentityDecoder {
  decode(holder: string): Promise<Identity>;
}
