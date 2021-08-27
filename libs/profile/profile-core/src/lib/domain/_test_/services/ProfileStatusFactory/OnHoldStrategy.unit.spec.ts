import 'reflect-metadata';
import { KYC, KycDecisionType, KycFraudType } from '@oney/profile-core';
import { LcbFtRiskLevel } from '@oney/payment-messages';
import { ProfileStatus } from '@oney/profile-messages';
import { OnHoldStrategy } from '../../../services/ProfileStatusStrategy/OnHoldStrategy';

describe('OnHoldStrategy should return status', () => {
  [KycDecisionType.KO_MANUAL, KycDecisionType.OK_MANUAL].map((decision: KycDecisionType) => {
    it(`CHECK_REQUIRED_AML when scoring decision is ${decision} and amlReceived is false`, () => {
      //Arrange
      const actualStatus: ProfileStatus = ProfileStatus.ON_HOLD;
      const kyc: KYC = {
        caseReference: '',
        decision: decision,
        fraud: KycFraudType.RISK_LOW,
        moneyLaunderingRisk: LcbFtRiskLevel.LOW,
        eligibility: null,
        amlReceived: false,
        eligibilityReceived: false,
      };

      //Act
      const nextStatus = OnHoldStrategy.nextStatus(actualStatus, kyc);

      //Assert
      expect(nextStatus).toEqual(ProfileStatus.CHECK_REQUIRED_AML);
    });
  });

  [KycDecisionType.KO_MANUAL, KycDecisionType.OK_MANUAL].map((decision: KycDecisionType) => {
    it(`ACTION_REQUIRED_TAX_NOTICE when scoring decision is ${decision} and amlReceived is true and AML Risk is HIGH`, () => {
      //Arrange
      const actualStatus: ProfileStatus = ProfileStatus.ON_HOLD;
      const kyc: KYC = {
        caseReference: '',
        decision: decision,
        moneyLaunderingRisk: LcbFtRiskLevel.HIGH,
        eligibility: null,
        amlReceived: true,
        eligibilityReceived: false,
      };

      //Act
      const nextStatus = OnHoldStrategy.nextStatus(actualStatus, kyc);

      //Assert
      expect(nextStatus).toEqual(ProfileStatus.ACTION_REQUIRED_TAX_NOTICE);
    });
  });

  [KycDecisionType.KO, KycDecisionType.PENDING_CLIENT, KycDecisionType.NOT_ELIGIBLE].map(
    (decision: KycDecisionType) => {
      it(`ACTION_REQUIRED_TAX_NOTICE when scoring decision is ${decision}`, () => {
        //Arrange
        const actualStatus: ProfileStatus = ProfileStatus.ON_HOLD;
        const kyc: KYC = {
          caseReference: '',
          decision: decision,
          amlReceived: true,
          eligibilityReceived: true,
        };

        //Act
        const nextStatus = OnHoldStrategy.nextStatus(actualStatus, kyc);

        //Assert
        expect(nextStatus).toEqual(ProfileStatus.ACTION_REQUIRED_TAX_NOTICE);
      });
    },
  );

  it('ACTION_REQUIRED_TAX_NOTICE when Scoring decision is PENDING_ADDITIONAL_INFO & fraud risk is RISK_MEDIUM', () => {
    //Arrange
    const actualStatus: ProfileStatus = ProfileStatus.ON_HOLD;
    const kyc: KYC = {
      caseReference: '',
      decision: KycDecisionType.PENDING_ADDITIONAL_INFO,
      fraud: KycFraudType.RISK_MEDIUM,
      eligibility: null,
      amlReceived: false,
      eligibilityReceived: false,
    };

    //Act
    const nextStatus = OnHoldStrategy.nextStatus(actualStatus, kyc);

    //Assert
    expect(nextStatus).toEqual(ProfileStatus.ACTION_REQUIRED_TAX_NOTICE);
  });

  [KycFraudType.RISK_LOW, KycFraudType.RISK_HIGH].map((fraud: KycFraudType) => {
    it(`ACTION_REQUIRED_ID when Scoring decision is PENDING_ADDITIONAL_INFO & fraud risk is ${fraud} & compliance is PENDING_CLIENT`, () => {
      //Arrange
      const actualStatus: ProfileStatus = ProfileStatus.ON_HOLD;
      const kyc: KYC = {
        caseReference: '',
        decision: KycDecisionType.PENDING_ADDITIONAL_INFO,
        fraud: fraud,
        compliance: KycDecisionType.PENDING_CLIENT,
        moneyLaunderingRisk: LcbFtRiskLevel.LOW,
        eligibility: null,
        amlReceived: false,
        eligibilityReceived: false,
      };

      //Act
      const nextStatus = OnHoldStrategy.nextStatus(actualStatus, kyc);

      //Assert
      expect(nextStatus).toEqual(ProfileStatus.ACTION_REQUIRED_ID);
    });
  });
});
