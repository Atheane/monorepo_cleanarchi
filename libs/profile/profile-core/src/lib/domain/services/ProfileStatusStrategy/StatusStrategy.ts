import { KYC } from '@oney/profile-core';
import { ProfileStatus } from '@oney/profile-messages';
import { OnBoardingStrategy } from './OnBoardingStrategy';
import { OnHoldStrategy } from './OnHoldStrategy';
import { ActionRequiredIdStrategy } from './ActionRequiredIdStrategy';
import { ActionRequiredTaxNoticeStrategy } from './ActionRequiredTaxNoticeStrategy';
import { CheckRequiredAmlStrategy } from './CheckRequiredAmlStrategy';
import { CheckEligibilityStrategy } from './CheckEligibilityStrategy';

export class StatusStrategy {
  static nextStatus(actualStatus: ProfileStatus, kyc: KYC): ProfileStatus {
    switch (actualStatus) {
      case ProfileStatus.ON_BOARDING:
        return OnBoardingStrategy.nextStatus(actualStatus, kyc);
      case ProfileStatus.ON_HOLD:
        return OnHoldStrategy.nextStatus(actualStatus, kyc);
      case ProfileStatus.ACTION_REQUIRED_ID:
        return ActionRequiredIdStrategy.nextStatus();
      case ProfileStatus.ACTION_REQUIRED_TAX_NOTICE:
        return ActionRequiredTaxNoticeStrategy.nextStatus(kyc);
      case ProfileStatus.CHECK_ELIGIBILITY:
        return CheckEligibilityStrategy.nextStatus(actualStatus, kyc);
      case ProfileStatus.CHECK_REQUIRED_AML:
        return CheckRequiredAmlStrategy.nextStatus(actualStatus, kyc);
      default:
        return actualStatus;
    }
  }
}
