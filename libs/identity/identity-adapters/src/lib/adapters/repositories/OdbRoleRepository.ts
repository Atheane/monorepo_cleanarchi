import { AuthErrors, IdentityProvider, Role, RoleRepository } from '@oney/identity-core';
import { injectable } from 'inversify';
import { RolesDictionnary } from '../inmemory/RolesDictionnary';

@injectable()
export class OdbRoleRepository implements RoleRepository {
  constructor(private readonly _rolesConfiguration: RolesDictionnary) {}

  async getById(provider: IdentityProvider, id: string): Promise<Role[]> {
    const roleInMemoryDb = this._rolesConfiguration.getRoles();
    if (!id && provider === IdentityProvider.odb) {
      return roleInMemoryDb.find(item => item.name === 'user').roles;
    }
    const providerRoles = roleInMemoryDb.find(item => item.id === id);
    if (!providerRoles) {
      throw new AuthErrors.RolesNotFound('ROLE_NOT_FOUND');
    }
    if (provider === IdentityProvider.odb) {
      return providerRoles.roles;
    }
    return providerRoles.roles;
  }
}
