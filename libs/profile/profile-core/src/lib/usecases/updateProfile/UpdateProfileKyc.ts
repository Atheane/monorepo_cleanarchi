import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../Identifiers';
import { Profile } from '../../domain/aggregates/Profile';
import { ProfileRepositoryRead } from '../../domain/repositories/read/ProfileRepositoryRead';
import { ProfileRepositoryWrite } from '../../domain/repositories/write/ProfileRepositoryWrite';
import { KYC } from '../../domain/valuesObjects/KYC';

@injectable()
export class UpdateProfileKyc implements Usecase<KYC, Profile> {
  constructor(
    @inject(Identifiers.profileRepositoryWrite)
    private readonly _profileRepositoryWrite: ProfileRepositoryWrite,
    @inject(Identifiers.profileRepositoryRead) private readonly _profileRepositoryRead: ProfileRepositoryRead,
    @inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher,
    @inject(Identifiers.featureFlagProfileStatusSaga) private readonly isProfileStatusSagaActive: boolean,
  ) {}

  async execute(request: KYC): Promise<Profile> {
    const updatedProfile: Profile = await this._profileRepositoryRead.getProfileByCaseReference(
      request.caseReference,
    );
    updatedProfile.updateKycDecision();
    if (!this.isProfileStatusSagaActive) {
      updatedProfile.updateStatus();
    }
    await this._profileRepositoryWrite.save(updatedProfile);
    await this.eventDispatcher.dispatch(updatedProfile);
    return updatedProfile;
  }
}
