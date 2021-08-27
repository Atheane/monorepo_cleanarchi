import 'reflect-metadata';
import { ProfileStatus } from '@oney/profile-messages';
import { OnBoardingStrategy } from '../../../adapters/saga/profileStatusStrategy/OnBoardingStrategy';
import { OnHoldStrategy } from '../../../adapters/saga/profileStatusStrategy/OnHoldStrategy';
import { ActionRequiredTaxNoticeStrategy } from '../../../adapters/saga/profileStatusStrategy/ActionRequiredTaxNoticeStrategy';
import { ActionRequiredIdStrategy } from '../../../adapters/saga/profileStatusStrategy/ActionRequiredIdStrategy';
import { CheckEligibilityStrategy } from '../../../adapters/saga/profileStatusStrategy/CheckEligibilityStrategy';
import { StatusStrategyFactory } from '../../../adapters/saga/profileStatusStrategy/StatusStrategyFactory';
import { CheckRequiredAmlStrategy } from '../../../adapters/saga/profileStatusStrategy/CheckRequiredAmlStrategy';
import { ActionRequiredActivateStrategy } from '../../../adapters/saga/profileStatusStrategy/ActionRequiredActivateStrategy';

describe('StatusStrategyFactory unit test', () => {
  [
    { status: ProfileStatus.ON_BOARDING, strategy: OnBoardingStrategy },
    { status: ProfileStatus.ON_HOLD, strategy: OnHoldStrategy },
    { status: ProfileStatus.ACTION_REQUIRED_ID, strategy: ActionRequiredIdStrategy },
    { status: ProfileStatus.ACTION_REQUIRED_TAX_NOTICE, strategy: ActionRequiredTaxNoticeStrategy },
    { status: ProfileStatus.CHECK_ELIGIBILITY, strategy: CheckEligibilityStrategy },
    { status: ProfileStatus.CHECK_REQUIRED_AML, strategy: CheckRequiredAmlStrategy },
    { status: ProfileStatus.ACTION_REQUIRED_ACTIVATE, strategy: ActionRequiredActivateStrategy },
  ].map(({ status, strategy }) => {
    it(`should return ${strategy.name} strategy when status is ${status}`, () => {
      //Act
      const result = StatusStrategyFactory.from(status);

      //Assert
      expect(result).toBeInstanceOf(strategy);
    });
  });
});
