import { KYC, KycDecisionType } from '@oney/profile-core';
import { ProfileStatus } from '@oney/profile-messages';

export class ActionRequiredTaxNoticeStrategy {
  static nextStatus(kyc: KYC): ProfileStatus {
    let newStatus: ProfileStatus;
    if (kyc.compliance === KycDecisionType.PENDING_CLIENT && kyc.taxNoticeUploaded) {
      newStatus = ProfileStatus.ACTION_REQUIRED_ID;
    }
    if (kyc.compliance !== KycDecisionType.PENDING_CLIENT && kyc.taxNoticeUploaded) {
      newStatus = ProfileStatus.ON_HOLD;
    }
    return newStatus;
  }
}
