import { IdentityProvider } from '../types/IdentityProvider';
import { Role } from '../valueobjects/Role';

export interface RoleRepository {
  getById(provider: IdentityProvider, id: string): Promise<Role[]>;
}
