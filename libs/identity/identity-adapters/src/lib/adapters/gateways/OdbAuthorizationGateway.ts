import { AuthErrors, AutorisationGateway, Identity } from '@oney/identity-core';
import { injectable, unmanaged } from 'inversify';

@injectable()
export class OdbAuthorizationGateway implements AutorisationGateway {
  constructor(@unmanaged() private readonly _serviceName: string) {}

  async isAuthorized(identity: Identity): Promise<boolean> {
    if (identity.roles.length === 0) {
      throw new AuthErrors.RolesNotFound('ROLES_NOT_FOUND');
    }
    const isHolderAuthorizeToAccessService = identity.roles.find(
      item => item.scope.name === this._serviceName,
    );
    if (!isHolderAuthorizeToAccessService) {
      const message = `SCOPE_NOT_FOUND_FOR_${this._serviceName.toUpperCase()}`;
      throw new AuthErrors.ScopeNotFound(message);
    }
    return !!isHolderAuthorizeToAccessService;
  }
}
