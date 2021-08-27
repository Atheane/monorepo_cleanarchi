import 'reflect-metadata';
import { KYC, KycDecisionType } from '@oney/profile-core';
import { ProfileStatus } from '@oney/profile-messages';
import { ActionRequiredTaxNoticeStrategy } from '../../../services/ProfileStatusStrategy/ActionRequiredTaxNoticeStrategy';

describe('ActionRequiredTaxNoticeStrategy should return status', () => {
  it('ACTION_REQUIRED_ID when Scoring compliance is PENDING_CLIENT', () => {
    //Arrange
    const kyc: KYC = {
      caseReference: '',
      compliance: KycDecisionType.PENDING_CLIENT,
      amlReceived: false,
      eligibilityReceived: true,
      taxNoticeUploaded: true,
    };

    //Act
    const nextStatus = ActionRequiredTaxNoticeStrategy.nextStatus(kyc);

    //Assert
    expect(nextStatus).toEqual(ProfileStatus.ACTION_REQUIRED_ID);
  });

  [
    KycDecisionType.PENDING_ADDITIONAL_INFO,
    KycDecisionType.OK_MANUAL,
    KycDecisionType.KO_MANUAL,
    KycDecisionType.OK,
    KycDecisionType.PENDING_REVIEW,
  ].map((compliance: KycDecisionType) => {
    it(`ON_HOLD when Scoring compliance is ${compliance}`, () => {
      //Arrange
      const kyc: KYC = {
        caseReference: '',
        compliance: compliance,
        amlReceived: false,
        eligibilityReceived: true,
        taxNoticeUploaded: true,
      };
      //Act
      const nextStatus = ActionRequiredTaxNoticeStrategy.nextStatus(kyc);

      //Assert
      expect(nextStatus).toEqual(ProfileStatus.ON_HOLD);
    });
  });
});
