import { DomainEvent } from '@oney/ddd';
import { KycDecisionType, ProfileStatus, UpdateProfileStatusCommand } from '@oney/profile-messages';
import { CommandStrategy } from './CommandStrategy';
import { ProfileSagaState } from '../types/ProfileSagaState';

export class CheckEligibilityStrategy implements CommandStrategy<ProfileSagaState> {
  nextCommand(profileSagaState: ProfileSagaState): DomainEvent {
    let newStatus: ProfileStatus = profileSagaState.status;

    if (this.shouldActivateRejectState(profileSagaState)) {
      newStatus = ProfileStatus.REJECTED;
    }

    if (this.shouldActivateActionRequiredActivateState(profileSagaState)) {
      newStatus = ProfileStatus.ACTION_REQUIRED_ACTIVATE;
    }

    if (!profileSagaState.eligibility.accountEligibility) {
      return new UpdateProfileStatusCommand(
        {
          uid: profileSagaState.uid,
          status: ProfileStatus.REJECTED,
        },
        { hours: 1 },
      );
    }

    return new UpdateProfileStatusCommand({ uid: profileSagaState.uid, status: newStatus });
  }

  private shouldActivateActionRequiredActivateState(profileSagaState: ProfileSagaState) {
    return (
      [KycDecisionType.OK, KycDecisionType.OK_MANUAL].includes(profileSagaState.scoring.decision) &&
      profileSagaState.eligibility.accountEligibility
    );
  }

  private shouldActivateRejectState(profileSagaState: ProfileSagaState) {
    return profileSagaState.scoring.decision === KycDecisionType.KO_MANUAL;
  }
}
