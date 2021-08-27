import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { ContractDocumentGateway, Steps } from '@oney/profile-core';
import { ProfileRepositoryRead } from '../domain/repositories/read/ProfileRepositoryRead';
import { Identifiers } from '../Identifiers';

export type GetContractCommand = { uid: string };

@injectable()
export class GetContract implements Usecase<GetContractCommand, Buffer> {
  constructor(
    @inject(Identifiers.profileRepositoryRead) private readonly _profileRepositoryRead: ProfileRepositoryRead,
    @inject(Identifiers.contractDocumentGateway)
    private readonly _contractDocumentGateway: ContractDocumentGateway,
  ) {}

  async execute({ uid }: GetContractCommand): Promise<Buffer> {
    const profile = await this._profileRepositoryRead.getUserById(uid);

    if (profile.hasOnboardingStep(Steps.CONTRACT_STEP)) {
      return await this._contractDocumentGateway.create(profile);
    } else {
      return await this._contractDocumentGateway.get(uid);
    }
  }

  async canExecute(identity: Identity, request: GetContractCommand): Promise<boolean> {
    const scope = identity.roles.find(item => item.scope.name === ServiceName.profile);
    if (!scope) {
      return false;
    }

    if (identity.uid === request.uid && scope.permissions.read === Authorization.self) {
      return true;
    }
    return false;
  }
}
