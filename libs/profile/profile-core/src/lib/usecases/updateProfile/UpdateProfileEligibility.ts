import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { AccountEligibilityCalculatedProps } from '@oney/cdp-messages';
import { EventProducerDispatcher } from '@oney/messages-core';
import { ProfileStatus } from '@oney/profile-messages';
import { Identifiers } from '../../Identifiers';
import { ProfileRepositoryWrite } from '../../domain/repositories/write/ProfileRepositoryWrite';
import { ProfileRepositoryRead } from '../../domain/repositories/read/ProfileRepositoryRead';
import { Profile } from '../../domain/aggregates/Profile';

@injectable()
export class UpdateProfileEligibility implements Usecase<AccountEligibilityCalculatedProps, Profile> {
  constructor(
    @inject(Identifiers.profileRepositoryWrite)
    private readonly _profileRepositoryWrite: ProfileRepositoryWrite,
    @inject(Identifiers.profileRepositoryRead) private readonly _profileRepositoryRead: ProfileRepositoryRead,
    @inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher,
    @inject(Identifiers.featureFlagProfileStatusSaga) private readonly isProfileStatusSagaActive: boolean,
  ) {}

  async execute(request: AccountEligibilityCalculatedProps): Promise<Profile> {
    const { uId, eligibility } = request;
    const profile = await this._profileRepositoryRead.getUserById(uId);
    const currentStatus = profile.props.informations.status;
    profile.updateEligibility(eligibility);
    if (!this.isProfileStatusSagaActive) {
      if (currentStatus === ProfileStatus.CHECK_ELIGIBILITY) {
        profile.updateStatus();
      }
    }
    await this._profileRepositoryWrite.save(profile);
    if (!this.isProfileStatusSagaActive) {
      if (currentStatus === ProfileStatus.CHECK_ELIGIBILITY) {
        await this.eventDispatcher.dispatch(profile);
      }
    }
    return profile;
  }
}
