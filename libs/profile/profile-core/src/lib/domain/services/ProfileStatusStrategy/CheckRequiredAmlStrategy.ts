import { KYC } from '@oney/profile-core';
import { LcbFtRiskLevel } from '@oney/payment-messages';
import { ProfileStatus } from '@oney/profile-messages';
import { CheckEligibilityStrategy } from './CheckEligibilityStrategy';

export class CheckRequiredAmlStrategy {
  static nextStatus(actualStatus: ProfileStatus, kyc: KYC): ProfileStatus {
    let newStatus = actualStatus;

    if (this.shouldBeActionRequiredTaxNotice(kyc)) {
      newStatus = ProfileStatus.ACTION_REQUIRED_TAX_NOTICE;
    } else if (this.shouldBeCheckEligibility(kyc)) {
      newStatus = ProfileStatus.CHECK_ELIGIBILITY;
    } else if (kyc.eligibilityReceived) {
      return CheckEligibilityStrategy.nextStatus(actualStatus, kyc);
    }

    return newStatus;
  }

  private static shouldBeActionRequiredTaxNotice(kyc: KYC): boolean {
    return kyc.moneyLaunderingRisk === LcbFtRiskLevel.HIGH;
  }

  private static shouldBeCheckEligibility(kyc: KYC): boolean {
    return (
      !kyc.eligibilityReceived &&
      [LcbFtRiskLevel.LOW, LcbFtRiskLevel.MEDIUM].includes(kyc.moneyLaunderingRisk)
    );
  }
}
