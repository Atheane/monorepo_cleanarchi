import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../Identifiers';
import { Profile } from '../../domain/aggregates/Profile';
import { FolderGateway } from '../../domain/gateways/FolderGateway';
import { UserGateway } from '../../domain/gateways/UserGateway';
import { ProfileRepositoryRead } from '../../domain/repositories/read/ProfileRepositoryRead';
import { ProfileRepositoryWrite } from '../../domain/repositories/write/ProfileRepositoryWrite';
import { DeclarativeFiscalSituation } from '../../domain/types/DeclarativeFiscalSituation';
import { FiscalReference } from '../../domain/valuesObjects/FiscalReference';

export interface FiscalStatusStepRequest {
  uid: string;
  fiscalReference: FiscalReference;
  declarativeFiscalSituation: DeclarativeFiscalSituation;
}

@injectable()
export class FiscalStatusStep implements Usecase<FiscalStatusStepRequest, Profile> {
  constructor(
    @inject(Identifiers.profileRepositoryRead) private readonly _profileRepositoryRead: ProfileRepositoryRead,
    @inject(Identifiers.profileRepositoryWrite)
    private readonly _profileRepositoryWrite: ProfileRepositoryWrite,
    @inject(Identifiers.folderGateway) private readonly _folderGateway: FolderGateway,
    @inject(Identifiers.userGateway) private readonly _userGateway: UserGateway,
    @inject(EventProducerDispatcher) private readonly _eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: FiscalStatusStepRequest): Promise<Profile> {
    const profile = await this._profileRepositoryRead.getUserById(request.uid);
    profile.updateFiscalStatus(request.fiscalReference, request.declarativeFiscalSituation);
    await this._userGateway.update(profile);
    await this._folderGateway.update(profile);
    await this._folderGateway.askForDecision(profile.props.kyc.caseReference);
    await this._profileRepositoryWrite.save(profile);
    await this._eventDispatcher.dispatch(profile);
    return profile;
  }

  async canExecute(identity: Identity, request: FiscalStatusStepRequest): Promise<boolean> {
    const scope = identity.roles.find(item => item.scope.name === ServiceName.profile);
    if (!scope) {
      return false;
    }

    if (
      identity.uid === request.uid &&
      scope.permissions.write === Authorization.self &&
      scope.permissions.read === Authorization.self
    ) {
      return true;
    }

    return false;
  }
}
