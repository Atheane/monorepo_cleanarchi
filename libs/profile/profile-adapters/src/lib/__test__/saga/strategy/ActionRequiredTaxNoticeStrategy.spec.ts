import 'reflect-metadata';
import { KycDecisionType } from '@oney/profile-core';
import { ProfileStatus, UpdateProfileStatusCommand } from '@oney/profile-messages';
import { DomainEvent } from '@oney/ddd';
import { ProfileSagaState } from '../../../adapters/saga/types/ProfileSagaState';
import { Scoring } from '../../../adapters/saga/types/Scoring';
import { ActionRequiredTaxNoticeStrategy } from '../../../adapters/saga/profileStatusStrategy/ActionRequiredTaxNoticeStrategy';

describe('ActionRequiredTaxNoticeStrategy should return event status', () => {
  const uid = 'beGe_flCm';

  it('ACTION_REQUIRED_ID when Scoring compliance is PENDING_CLIENT', () => {
    //Arrange
    const actionRequiredTaxNoticeStrategy = new ActionRequiredTaxNoticeStrategy();
    const profileSagaState = {
      uid,
      status: ProfileStatus.ACTION_REQUIRED_TAX_NOTICE,
      scoring: { compliance: KycDecisionType.PENDING_CLIENT } as Scoring,
    } as ProfileSagaState;

    //Act
    const nextCommand: DomainEvent<any> = actionRequiredTaxNoticeStrategy.nextCommand(profileSagaState);

    //Assert
    expect(nextCommand).toBeInstanceOf(UpdateProfileStatusCommand);
    expect(nextCommand.props.status).toEqual(ProfileStatus.ACTION_REQUIRED_ID);
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
      const actionRequiredTaxNoticeStrategy = new ActionRequiredTaxNoticeStrategy();
      const profileSagaState = {
        uid,
        status: ProfileStatus.ACTION_REQUIRED_TAX_NOTICE,
        scoring: { compliance: compliance } as Scoring,
      } as ProfileSagaState;

      //Act
      const nextCommand: DomainEvent<any> = actionRequiredTaxNoticeStrategy.nextCommand(profileSagaState);

      //Assert
      expect(nextCommand).toBeInstanceOf(UpdateProfileStatusCommand);
      expect(nextCommand.props.status).toEqual(ProfileStatus.ON_HOLD);
    });
  });
});
