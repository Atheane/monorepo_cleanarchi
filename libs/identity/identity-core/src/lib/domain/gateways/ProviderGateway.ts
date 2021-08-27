import { IdentityProvider } from '../types/IdentityProvider';

export interface ProviderGateway {
  find(holder: string): Promise<IdentityProvider>;
}
