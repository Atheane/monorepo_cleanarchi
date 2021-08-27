import { Identity } from '../entities/Identity';

export interface IdentityService {
  // Route to different implementation via factory.
  handle(holder: string): Promise<Identity>;
}
