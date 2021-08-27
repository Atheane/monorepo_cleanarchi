import { DomainEvent } from '@oney/ddd';
import { ProfileStatus } from '@oney/profile-messages';
import { LcbFtRiskLevel } from '@oney/payment-messages';
import { UpdateProfileStatusCommand } from '@oney/profile-messages';
import { CheckEligibilityStrategy } from './CheckEligibilityStrategy';
import { CommandStrategy } from './CommandStrategy';
import { ProfileSagaState } from '../types/ProfileSagaState';

export class CheckRequiredAmlStrategy implements CommandStrategy<ProfileSagaState> {
  nextCommand(profileSagaState: ProfileSagaState): DomainEvent {
    let newStatus: ProfileStatus = profileSagaState.status;

    if (this.shouldReturnActionRequiredTaxNotice(profileSagaState)) {
      newStatus = ProfileStatus.ACTION_REQUIRED_TAX_NOTICE;
    }

    if (this.shouldReturnCheckEligibility(profileSagaState)) {
      newStatus = ProfileStatus.CHECK_ELIGIBILITY;
    }

    if (profileSagaState.eligibilityReceived) {
      return new CheckEligibilityStrategy().nextCommand(profileSagaState);
    }

    return new UpdateProfileStatusCommand({ uid: profileSagaState.uid, status: newStatus });
  }

  private shouldReturnActionRequiredTaxNotice(profileSagaState: ProfileSagaState): boolean {
    return profileSagaState.risk === LcbFtRiskLevel.HIGH;
  }

  private shouldReturnCheckEligibility(profileSagaState: ProfileSagaState): boolean {
    return (
      !profileSagaState.eligibilityReceived &&
      [LcbFtRiskLevel.LOW, LcbFtRiskLevel.MEDIUM].includes(profileSagaState.risk)
    );
  }
}
