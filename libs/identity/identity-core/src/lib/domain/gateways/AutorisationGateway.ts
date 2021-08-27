import { Identity } from '../entities/Identity';

export interface AutorisationGateway {
  isAuthorized(identity: Identity): Promise<boolean>;
}
