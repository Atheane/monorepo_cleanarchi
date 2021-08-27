import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { LcbFtUpdatedProps } from '@oney/payment-messages';
import { Identifiers } from '../../Identifiers';
import { Profile } from '../../domain/aggregates/Profile';
import { ProfileRepositoryRead } from '../../domain/repositories/read/ProfileRepositoryRead';
import { ProfileRepositoryWrite } from '../../domain/repositories/write/ProfileRepositoryWrite';

@injectable()
export class UpdateProfileLcbFt implements Usecase<LcbFtUpdatedProps, Profile> {
  constructor(
    @inject(Identifiers.profileRepositoryWrite)
    private readonly _profileRepositoryWrite: ProfileRepositoryWrite,
    @inject(Identifiers.profileRepositoryRead) private readonly _profileRepositoryRead: ProfileRepositoryRead,
    @inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher,
    @inject(Identifiers.featureFlagProfileStatusSaga) private readonly isProfileStatusSagaActive: boolean,
  ) {}

  async execute(request: LcbFtUpdatedProps): Promise<Profile> {
    const profileToUpdate = await this._profileRepositoryRead.getUserById(request.appUserId);
    profileToUpdate.updateLcbFt(request.riskLevel);
    if (!this.isProfileStatusSagaActive) {
      profileToUpdate.updateStatus();
    }
    await this._profileRepositoryWrite.save(profileToUpdate);
    await this.eventDispatcher.dispatch(profileToUpdate);
    return profileToUpdate;
  }
}
