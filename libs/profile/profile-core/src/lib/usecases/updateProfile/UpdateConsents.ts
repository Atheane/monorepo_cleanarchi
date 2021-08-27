import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import {
  Consents,
  Profile,
  ProfileRepositoryWrite,
  ProfileRepositoryRead,
  CustomerGateway,
} from '@oney/profile-core';
import { EventProducerDispatcher } from '@oney/messages-core';
import { Identifiers } from '../../Identifiers';

export type UpdateConsentsCommand = { uid: string; consents: Consents };

@injectable()
export class UpdateConsents implements Usecase<UpdateConsentsCommand, Profile> {
  constructor(
    @inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher,
    @inject(Identifiers.profileRepositoryRead) private readonly _profileRepositoryRead: ProfileRepositoryRead,
    @inject(Identifiers.customerGateway) private readonly _customerGateway: CustomerGateway,
    @inject(Identifiers.profileRepositoryWrite)
    private readonly _profileRepositoryWrite: ProfileRepositoryWrite,
  ) {}

  async execute({ uid, consents }: UpdateConsentsCommand): Promise<Profile> {
    const profile = await this._profileRepositoryRead.getUserById(uid);
    profile.updateConsent(consents);

    await this._customerGateway.update(profile);
    await this._profileRepositoryWrite.save(profile);
    await this.eventDispatcher.dispatch(profile);

    return profile;
  }

  async canExecute(identity: Identity, request: UpdateConsentsCommand): Promise<boolean> {
    const scope = identity.roles.find(item => item.scope.name === ServiceName.profile);
    if (!scope) {
      return false;
    }

    if (
      (identity.uid === request.uid && scope.permissions.write === Authorization.self) ||
      scope.permissions.write === Authorization.all
    ) {
      return true;
    }
  }
}
