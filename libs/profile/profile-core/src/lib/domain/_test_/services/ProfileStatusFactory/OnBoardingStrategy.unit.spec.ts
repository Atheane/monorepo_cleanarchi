import 'reflect-metadata';
import { KYC, KycDecisionType, KycFraudType } from '@oney/profile-core';
import { LcbFtRiskLevel } from '@oney/payment-messages';
import { ProfileStatus } from '@oney/profile-messages';
import { OnBoardingStrategy } from '../../../services/ProfileStatusStrategy/OnBoardingStrategy';

describe('OnBoardingStrategy should return status', () => {
  it('BLOCKED_ALREADY_EXISTS when scoring flag_existingIdentity is true', () => {
    //Arrange
    const actualStatus: ProfileStatus = ProfileStatus.ON_BOARDING;
    const kyc: KYC = {
      caseReference: '',
      decision: KycDecisionType.PENDING_REVIEW,
      fraud: KycFraudType.RISK_LOW,
      moneyLaunderingRisk: LcbFtRiskLevel.LOW,
      eligibility: null,
      amlReceived: false,
      eligibilityReceived: false,
      existingIdentity: true,
    };

    //Act
    const nextStatus = OnBoardingStrategy.nextStatus(actualStatus, kyc);

    //Assert
    expect(nextStatus).toEqual(ProfileStatus.BLOCKED_ALREADY_EXISTS);
  });

  it('ON_HOLD when scoring decision is NULL', () => {
    //Arrange
    const actualStatus: ProfileStatus = ProfileStatus.ON_BOARDING;
    const kyc: KYC = {
      caseReference: '',
      decision: null,
      fraud: null,
      moneyLaunderingRisk: null,
      eligibility: null,
      amlReceived: null,
      eligibilityReceived: null,
    };

    //Act
    const nextStatus = OnBoardingStrategy.nextStatus(actualStatus, kyc);

    //Assert
    expect(nextStatus).toEqual(ProfileStatus.ON_HOLD);
  });

  it('ON_HOLD when scoring decision is PENDING_REVIEW', () => {
    //Arrange
    const actualStatus: ProfileStatus = ProfileStatus.ON_BOARDING;
    const kyc: KYC = {
      caseReference: '',
      decision: KycDecisionType.PENDING_REVIEW,
      fraud: KycFraudType.RISK_LOW,
      moneyLaunderingRisk: LcbFtRiskLevel.LOW,
      eligibility: null,
      amlReceived: false,
      eligibilityReceived: false,
    };

    //Act
    const nextStatus = OnBoardingStrategy.nextStatus(actualStatus, kyc);

    //Assert
    expect(nextStatus).toEqual(ProfileStatus.ON_HOLD);
  });

  it('ACTION_REQUIRED_TAX_NOTICE when scoring decision is PENDING_ADDITIONAL_INFO & fraud risk is RISK_MEDIUM', () => {
    //Arrange
    const actualStatus: ProfileStatus = ProfileStatus.ON_BOARDING;
    const kyc: KYC = {
      caseReference: '',
      decision: KycDecisionType.PENDING_ADDITIONAL_INFO,
      fraud: KycFraudType.RISK_MEDIUM,
      eligibility: null,
      amlReceived: false,
      eligibilityReceived: false,
    };

    //Act
    const nextStatus = OnBoardingStrategy.nextStatus(actualStatus, kyc);

    //Assert
    expect(nextStatus).toEqual(ProfileStatus.ACTION_REQUIRED_TAX_NOTICE);
  });

  it('ACTION_REQUIRED_TAX_NOTICE when scoring decision is OK Risk is High and amlReceived', () => {
    //Arrange
    const actualStatus: ProfileStatus = ProfileStatus.ON_BOARDING;
    const kyc: KYC = {
      caseReference: '',
      decision: KycDecisionType.OK,
      fraud: KycFraudType.RISK_HIGH,
      moneyLaunderingRisk: LcbFtRiskLevel.HIGH,
      eligibility: null,
      amlReceived: true,
      eligibilityReceived: false,
    };

    //Act
    const nextStatus = OnBoardingStrategy.nextStatus(actualStatus, kyc);

    //Assert
    expect(nextStatus).toEqual(ProfileStatus.ACTION_REQUIRED_TAX_NOTICE);
  });

  [KycFraudType.RISK_LOW, KycFraudType.RISK_HIGH].map((fraud: KycFraudType) => {
    it(`ACTION_REQUIRED_ID when scoring decision is PENDING_ADDITIONAL_INFO & fraud risk is ${fraud} & compliance is PENDING_CLIENT`, () => {
      //Arrange
      const actualStatus: ProfileStatus = ProfileStatus.ON_BOARDING;
      const kyc: KYC = {
        caseReference: '',
        decision: KycDecisionType.PENDING_ADDITIONAL_INFO,
        fraud: fraud,
        compliance: KycDecisionType.PENDING_CLIENT,
        eligibility: null,
        amlReceived: false,
        eligibilityReceived: false,
      };

      //Act
      const nextStatus = OnBoardingStrategy.nextStatus(actualStatus, kyc);

      //Assert
      expect(nextStatus).toEqual(ProfileStatus.ACTION_REQUIRED_ID);
    });
  });

  it('CHECK_REQUIRED_AML when scoring decision is OK and amlReceived is false', () => {
    //Arrange
    const actualStatus: ProfileStatus = ProfileStatus.ON_BOARDING;
    const kyc: KYC = {
      caseReference: '',
      decision: KycDecisionType.OK,
      eligibility: null,
      amlReceived: false,
      eligibilityReceived: false,
    };
    //Act
    const nextStatus = OnBoardingStrategy.nextStatus(actualStatus, kyc);

    //Assert
    expect(nextStatus).toEqual(ProfileStatus.CHECK_REQUIRED_AML);
  });
});
