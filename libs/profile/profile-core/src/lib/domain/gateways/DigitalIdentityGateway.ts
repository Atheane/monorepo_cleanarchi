import { DigitalIdentity } from '../entities/DigitalIdentity';

export interface DigitalIdentityGateway {
  create(email: string): Promise<DigitalIdentity>;
}
