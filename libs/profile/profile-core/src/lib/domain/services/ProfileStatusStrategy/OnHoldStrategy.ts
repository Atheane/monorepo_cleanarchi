import { KYC, KycDecisionType, KycFraudType } from '@oney/profile-core';
import { ProfileStatus } from '@oney/profile-messages';
import { CheckRequiredAmlStrategy } from './CheckRequiredAmlStrategy';

export class OnHoldStrategy {
  static nextStatus(actualStatus: ProfileStatus, kyc: KYC): ProfileStatus {
    let newStatus = actualStatus;

    if (this.shouldBeActionRequiredTaxNotice(kyc)) {
      newStatus = ProfileStatus.ACTION_REQUIRED_TAX_NOTICE;
    } else if (this.shouldBeActionRequiredId(kyc)) {
      newStatus = ProfileStatus.ACTION_REQUIRED_ID;
    } else if (this.shouldBeCheckRequiredAml(kyc)) {
      newStatus = ProfileStatus.CHECK_REQUIRED_AML;
    } else if (kyc.amlReceived) {
      return CheckRequiredAmlStrategy.nextStatus(actualStatus, kyc);
    }

    return newStatus;
  }

  private static shouldBeCheckRequiredAml(kyc: KYC): boolean {
    return [KycDecisionType.OK_MANUAL, KycDecisionType.KO_MANUAL].includes(kyc.decision) && !kyc.amlReceived;
  }

  private static shouldBeActionRequiredTaxNotice(kyc: KYC): boolean {
    return (
      [KycDecisionType.KO, KycDecisionType.PENDING_CLIENT, KycDecisionType.NOT_ELIGIBLE].includes(
        kyc.decision,
      ) ||
      (kyc.decision === KycDecisionType.PENDING_ADDITIONAL_INFO && kyc.fraud === KycFraudType.RISK_MEDIUM)
    );
  }

  private static shouldBeActionRequiredId(kyc: KYC): boolean {
    return (
      kyc.decision === KycDecisionType.PENDING_ADDITIONAL_INFO &&
      kyc.compliance === KycDecisionType.PENDING_CLIENT &&
      [KycFraudType.RISK_LOW, KycFraudType.RISK_HIGH].includes(kyc.fraud)
    );
  }
}
