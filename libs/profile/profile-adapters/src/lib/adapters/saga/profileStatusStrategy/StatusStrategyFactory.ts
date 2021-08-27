import { ProfileStatus } from '@oney/profile-messages';
import { SagaState } from '@oney/saga-core';
import { OnBoardingStrategy } from './OnBoardingStrategy';
import { OnHoldStrategy } from './OnHoldStrategy';
import { CheckEligibilityStrategy } from './CheckEligibilityStrategy';
import { ActionRequiredIdStrategy } from './ActionRequiredIdStrategy';
import { ActionRequiredTaxNoticeStrategy } from './ActionRequiredTaxNoticeStrategy';
import { CheckRequiredAmlStrategy } from './CheckRequiredAmlStrategy';
import { ActionRequiredActivateStrategy } from './ActionRequiredActivateStrategy';
import { CommandStrategy } from './CommandStrategy';

export class StatusStrategyFactory {
  public static from(label: ProfileStatus): CommandStrategy<SagaState> {
    switch (label) {
      case ProfileStatus.ON_BOARDING:
        return new OnBoardingStrategy();
      case ProfileStatus.ON_HOLD:
        return new OnHoldStrategy();
      case ProfileStatus.ACTION_REQUIRED_ID:
        return new ActionRequiredIdStrategy();
      case ProfileStatus.ACTION_REQUIRED_TAX_NOTICE:
        return new ActionRequiredTaxNoticeStrategy();
      case ProfileStatus.CHECK_ELIGIBILITY:
        return new CheckEligibilityStrategy();
      case ProfileStatus.CHECK_REQUIRED_AML:
        return new CheckRequiredAmlStrategy();
      case ProfileStatus.ACTION_REQUIRED_ACTIVATE:
        return new ActionRequiredActivateStrategy();
    }
  }
}
