import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { inject, injectable } from 'inversify';
import { BankAccountIdentity } from '../../domain/valuesObjects/BankAccountIdentity';
import { Identifiers } from '../../Identifiers';
import { ProfileRepositoryRead } from '../../domain/repositories/read/ProfileRepositoryRead';
import { FolderGateway } from '../../domain/gateways/FolderGateway';

export interface BankAccountOwnerCommand {
  uid: string;
  identity?: string;
  lastName?: string;
  firstName?: string;
  birthDate?: string;
  bankName: string;
}

@injectable()
export class VerifyBankAccountOwner implements Usecase<BankAccountOwnerCommand, boolean> {
  constructor(
    @inject(Identifiers.profileRepositoryRead) private readonly profileRepositoryRead: ProfileRepositoryRead,
    @inject(Identifiers.folderGateway) private readonly _folderGateway: FolderGateway,
  ) {}

  async execute(request: BankAccountOwnerCommand): Promise<boolean> {
    const profile = await this.profileRepositoryRead.getUserById(request.uid);
    const bankAccountIdentity = new BankAccountIdentity({
      ...request,
    });
    return await this._folderGateway.isBankAccountOwner({
      uid: profile.props.uid,
      identity: {
        profileInformation: profile.props.informations,
        bankAccountIdentity,
      },
    });
  }

  canExecute(identity: Identity): Promise<boolean> | boolean {
    const scope = identity.roles.find(item => item.scope.name === ServiceName.profile);
    return scope && scope.permissions.read === Authorization.all;
  }
}
