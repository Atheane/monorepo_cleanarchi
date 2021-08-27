import 'reflect-metadata';
import { KYC } from '@oney/profile-core';
import { LcbFtRiskLevel } from '@oney/payment-messages';
import { ProfileStatus } from '@oney/profile-messages';
import { CheckRequiredAmlStrategy } from '../../../services/ProfileStatusStrategy/CheckRequiredAmlStrategy';

describe('CheckRequiredAmlStrategy should return status', () => {
  it(`ACTION_REQUIRED_TAX_NOTICE when Risk is HIGH`, () => {
    //Arrange
    const actualStatus: ProfileStatus = ProfileStatus.CHECK_REQUIRED_AML;
    const kyc: KYC = {
      caseReference: '',
      moneyLaunderingRisk: LcbFtRiskLevel.HIGH,
      eligibility: null,
      amlReceived: false,
      eligibilityReceived: true,
    };

    //Act
    const nextStatus = CheckRequiredAmlStrategy.nextStatus(actualStatus, kyc);

    //Assert
    expect(nextStatus).toEqual(ProfileStatus.ACTION_REQUIRED_TAX_NOTICE);
  });

  [LcbFtRiskLevel.LOW, LcbFtRiskLevel.MEDIUM].map((moneyLaunderingRisk: LcbFtRiskLevel) => {
    it(`CHECK_ELIGIBILITY when Risk is ${moneyLaunderingRisk} and eligibilityReceived is false`, () => {
      //Arrange
      const actualStatus: ProfileStatus = ProfileStatus.CHECK_REQUIRED_AML;
      const kyc: KYC = {
        caseReference: '',
        moneyLaunderingRisk: moneyLaunderingRisk,
        eligibility: null,
        amlReceived: false,
        eligibilityReceived: false,
      };

      //Act
      const nextStatus = CheckRequiredAmlStrategy.nextStatus(actualStatus, kyc);

      //Assert
      expect(nextStatus).toEqual(ProfileStatus.CHECK_ELIGIBILITY);
    });
  });

  it(`REJECTED when eligibilityReceived and accountEligibility is false`, () => {
    //Arrange
    const actualStatus: ProfileStatus = ProfileStatus.CHECK_REQUIRED_AML;
    const kyc: KYC = {
      caseReference: '',
      amlReceived: true,
      moneyLaunderingRisk: LcbFtRiskLevel.MEDIUM,
      eligibilityReceived: true,
      eligibility: { accountEligibility: false },
    };

    //Act
    const nextStatus = CheckRequiredAmlStrategy.nextStatus(actualStatus, kyc);

    //Assert
    expect(nextStatus).toEqual(ProfileStatus.REJECTED);
  });
});
