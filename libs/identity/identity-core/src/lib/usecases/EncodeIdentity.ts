import { inject, injectable } from 'inversify';
import { IdentityIdentifier } from '../IdentityIdentifier';
import { IdentityEncoder } from '../domain/gateways/IdentityEncoder';
import { Usecase } from '../domain/models/Usecase';
import { RoleRepository } from '../domain/repository/RoleRepository';
import { IdentityProvider } from '../domain/types/IdentityProvider';

interface EncodeIdentityRequest {
  uid: string;
  email: string;
  provider: IdentityProvider;
  providerId?: string;
}

@injectable()
export class EncodeIdentity implements Usecase<EncodeIdentityRequest, string> {
  constructor(
    @inject(IdentityIdentifier.identityEncoder) private readonly _identityEncoder: IdentityEncoder,
    @inject(IdentityIdentifier.roleRepository) private readonly _roleRepository: RoleRepository,
  ) {}

  async execute(request: EncodeIdentityRequest): Promise<string> {
    const rolesCollection = await this._roleRepository.getById(request.provider, request.providerId);
    return await this._identityEncoder.encode({
      ...request,
      roles: rolesCollection,
      name: IdentityProvider.odb,
    });
  }
}
