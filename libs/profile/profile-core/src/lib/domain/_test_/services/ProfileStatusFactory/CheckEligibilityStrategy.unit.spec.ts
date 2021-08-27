import 'reflect-metadata';
import { KYC, KycDecisionType } from '@oney/profile-core';
import { ProfileStatus } from '@oney/profile-messages';
import { CheckEligibilityStrategy } from '../../../services/ProfileStatusStrategy/CheckEligibilityStrategy';

describe('CheckEligibilityStrategy should return status', () => {
  [KycDecisionType.OK, KycDecisionType.OK_MANUAL].map((decision: KycDecisionType) => {
    it(`ACTION_REQUIRED_ACTIVATE when Scoring decision is ${decision}`, () => {
      //Arrange
      const actualStatus: ProfileStatus = ProfileStatus.CHECK_ELIGIBILITY;
      const kyc: KYC = {
        caseReference: '',
        decision: decision,
        eligibility: { accountEligibility: true },
        amlReceived: false,
        eligibilityReceived: true,
      };

      //Act
      const nextStatus = CheckEligibilityStrategy.nextStatus(actualStatus, kyc);

      //Assert
      expect(nextStatus).toEqual(ProfileStatus.ACTION_REQUIRED_ACTIVATE);
    });
  });

  it(`REJECTED when Scoring decision is KO_MANUAL`, () => {
    //Arrange
    const actualStatus: ProfileStatus = ProfileStatus.CHECK_ELIGIBILITY;
    const kyc: KYC = {
      caseReference: '',
      decision: KycDecisionType.KO_MANUAL,
      eligibility: { accountEligibility: true },
      amlReceived: false,
      eligibilityReceived: true,
    };

    //Act
    const nextStatus = CheckEligibilityStrategy.nextStatus(actualStatus, kyc);

    //Assert
    expect(nextStatus).toEqual(ProfileStatus.REJECTED);
  });

  it(`CHECK_ELIGIBILITY when eligibility is not received yet`, () => {
    //Arrange
    const actualStatus: ProfileStatus = ProfileStatus.CHECK_ELIGIBILITY;
    const kyc: KYC = {
      caseReference: '',
      decision: KycDecisionType.OK,
      eligibility: null,
      amlReceived: false,
      eligibilityReceived: true,
    };

    //Act
    const nextStatus = CheckEligibilityStrategy.nextStatus(actualStatus, kyc);

    //Assert
    expect(nextStatus).toEqual(ProfileStatus.CHECK_ELIGIBILITY);
  });

  it(`REJECTED with delay when is not eligible`, () => {
    //Arrange
    const actualStatus: ProfileStatus = ProfileStatus.CHECK_ELIGIBILITY;
    const kyc: KYC = {
      caseReference: '',
      decision: KycDecisionType.OK,
      eligibility: { accountEligibility: false },
      amlReceived: false,
      eligibilityReceived: true,
    };

    //Act
    const nextStatus = CheckEligibilityStrategy.nextStatus(actualStatus, kyc);

    //Assert
    expect(nextStatus).toEqual(ProfileStatus.REJECTED);
  });
});
