import { KYC, KycDecisionType } from '@oney/profile-core';
import { ProfileStatus } from '@oney/profile-messages';

export class CheckEligibilityStrategy {
  static nextStatus(actualStatus: ProfileStatus, kyc: KYC): ProfileStatus {
    let newStatus = actualStatus;

    if (!kyc.eligibility) return newStatus;

    if (this.shouldBeReject(kyc)) {
      newStatus = ProfileStatus.REJECTED;
    } else if (this.shouldBeActionRequiredActivate(kyc)) {
      newStatus = ProfileStatus.ACTION_REQUIRED_ACTIVATE;
    } else if (!kyc.eligibility.accountEligibility) {
      //TODO after 1h
      newStatus = ProfileStatus.REJECTED;
    }

    return newStatus;
  }

  private static shouldBeActionRequiredActivate(kyc: KYC) {
    return (
      [KycDecisionType.OK, KycDecisionType.OK_MANUAL].includes(kyc.decision) &&
      kyc.eligibility.accountEligibility
    );
  }

  private static shouldBeReject(kyc: KYC) {
    return kyc.decision === KycDecisionType.KO_MANUAL;
  }
}
