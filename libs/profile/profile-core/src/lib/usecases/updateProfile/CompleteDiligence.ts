import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { ProfileStatus, ProfileActivationType } from '@oney/profile-messages';
import { DiligenceStatus } from '@oney/payment-messages';
import { DiligenceSctInCallbackPayloadProperties } from '../../domain/types/payment/DiligenceSctInCallbackPayloadProperties';
import { Profile } from '../../domain/aggregates/Profile';
import { Identifiers } from '../../Identifiers';
import { ProfileRepositoryWrite } from '../../domain/repositories/write/ProfileRepositoryWrite';
import { ProfileRepositoryRead } from '../../domain/repositories/read/ProfileRepositoryRead';

@injectable()
export class CompleteDiligence implements Usecase<DiligenceSctInCallbackPayloadProperties, Profile> {
  constructor(
    @inject(Identifiers.profileRepositoryWrite)
    private readonly _profileRepositoryWrite: ProfileRepositoryWrite,
    @inject(Identifiers.profileRepositoryRead) private readonly _profileRepositoryRead: ProfileRepositoryRead,
    @inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: DiligenceSctInCallbackPayloadProperties): Promise<Profile> {
    const profileToUpdate = await this._profileRepositoryRead.getUserById(request.appUserId);
    let updatedProfile: Profile;

    switch (request.status) {
      case DiligenceStatus.VALIDATED:
        // TODO: refacto this to only apply status change in activate method
        updatedProfile = profileToUpdate.completeDiligence(ProfileStatus.ACTIVE);
        updatedProfile.activate(ProfileActivationType.TRANSFER);
        break;
      case DiligenceStatus.REFUSED:
        updatedProfile = profileToUpdate.completeDiligence(ProfileStatus.ACTION_REQUIRED_ACTIVATE);
        break;
    }

    await this._profileRepositoryWrite.save(updatedProfile);

    await this.eventDispatcher.dispatch(updatedProfile);

    return updatedProfile;
  }
}
