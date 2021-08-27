import { DomainEvent } from '@oney/ddd';
import { KycDecisionType, ProfileStatus, UpdateProfileStatusCommand } from '@oney/profile-messages';
import { KycFraudType } from '@oney/profile-core';
import { CommandStrategy } from './CommandStrategy';
import { CheckRequiredAmlStrategy } from './CheckRequiredAmlStrategy';
import { ProfileSagaState } from '../types/ProfileSagaState';

export class OnHoldStrategy implements CommandStrategy<ProfileSagaState> {
  nextCommand(profileSagaState: ProfileSagaState): DomainEvent {
    let newStatus: ProfileStatus = profileSagaState.status;

    if (this.shouldActivateActionRequiredTaxNoticeState(profileSagaState)) {
      newStatus = ProfileStatus.ACTION_REQUIRED_TAX_NOTICE;
    }
    if (this.shouldActivateActionRequiredIdState(profileSagaState)) {
      newStatus = ProfileStatus.ACTION_REQUIRED_ID;
    }

    if (this.shouldActivateCheckRequiredAmlState(profileSagaState)) {
      newStatus = ProfileStatus.CHECK_REQUIRED_AML;
    }

    if (profileSagaState.amlReceived) {
      return new CheckRequiredAmlStrategy().nextCommand(profileSagaState);
    }

    return new UpdateProfileStatusCommand({ uid: profileSagaState.uid, status: newStatus });
  }

  private shouldActivateCheckRequiredAmlState(profileSagaState: ProfileSagaState): boolean {
    return (
      [KycDecisionType.OK_MANUAL, KycDecisionType.KO_MANUAL].includes(profileSagaState.scoring.decision) &&
      !profileSagaState.amlReceived
    );
  }

  private shouldActivateActionRequiredTaxNoticeState(profileSagaState: ProfileSagaState): boolean {
    return (
      [KycDecisionType.KO, KycDecisionType.PENDING_CLIENT, KycDecisionType.NOT_ELIGIBLE].includes(
        profileSagaState.scoring.decision,
      ) ||
      (profileSagaState.scoring.decision === KycDecisionType.PENDING_ADDITIONAL_INFO &&
        profileSagaState.scoring.fraud === KycFraudType.RISK_MEDIUM)
    );
  }

  private shouldActivateActionRequiredIdState(profileSagaState: ProfileSagaState): boolean {
    return (
      profileSagaState.scoring.decision === KycDecisionType.PENDING_ADDITIONAL_INFO &&
      profileSagaState.scoring.compliance === KycDecisionType.PENDING_CLIENT &&
      [KycFraudType.RISK_LOW, KycFraudType.RISK_HIGH].includes(profileSagaState.scoring.fraud)
    );
  }
}
