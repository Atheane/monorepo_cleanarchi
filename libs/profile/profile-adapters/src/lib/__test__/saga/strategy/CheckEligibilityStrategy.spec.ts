import 'reflect-metadata';
import { KycDecisionType, ProfileStatus } from '@oney/profile-messages';
import { UpdateProfileStatusCommand } from '@oney/profile-messages';
import { DomainEvent } from '@oney/ddd';
import { ProfileSagaState } from '../../../adapters/saga/types/ProfileSagaState';
import { CheckEligibilityStrategy } from '../../../adapters/saga/profileStatusStrategy/CheckEligibilityStrategy';

describe('CheckEligibilityStrategy should return event status', () => {
  const uid = 'beGe_flCm';

  [KycDecisionType.OK, KycDecisionType.OK_MANUAL].map((decision: KycDecisionType) => {
    it(`ACTION_REQUIRED_ACTIVATE when Scoring decision is ${decision}`, () => {
      //Arrange
      const checkEligibilityStrategy = new CheckEligibilityStrategy();
      const profileSagaState = {
        uid,
        status: ProfileStatus.CHECK_ELIGIBILITY,
        eligibility: { accountEligibility: true },
        eligibilityReceived: true,
        scoring: { decision },
      } as ProfileSagaState;

      //Act
      const nextCommand: DomainEvent<any> = checkEligibilityStrategy.nextCommand(profileSagaState);

      //Assert
      expect(nextCommand).toBeInstanceOf(UpdateProfileStatusCommand);
      expect(nextCommand.props.status).toEqual(ProfileStatus.ACTION_REQUIRED_ACTIVATE);
    });
  });

  it(`REJECTED when Scoring decision is KO_MANUAL`, () => {
    //Arrange
    const checkEligibilityStrategy = new CheckEligibilityStrategy();
    const profileSagaState = {
      uid,
      status: ProfileStatus.CHECK_ELIGIBILITY,
      eligibility: { accountEligibility: true },
      eligibilityReceived: true,
      scoring: { decision: KycDecisionType.KO_MANUAL },
    } as ProfileSagaState;

    //Act
    const nextCommand: DomainEvent<any> = checkEligibilityStrategy.nextCommand(profileSagaState);

    //Assert
    expect(nextCommand).toBeInstanceOf(UpdateProfileStatusCommand);
    expect(nextCommand.props.status).toEqual(ProfileStatus.REJECTED);
  });

  it(`REJECTED with delay when is not eligible`, () => {
    //Arrange
    const checkEligibilityStrategy = new CheckEligibilityStrategy();
    const profileSagaState = {
      uid,
      status: ProfileStatus.CHECK_ELIGIBILITY,
      eligibility: { accountEligibility: false },
      eligibilityReceived: true,
      scoring: { decision: KycDecisionType.OK },
    } as ProfileSagaState;

    //Act
    const nextCommand: DomainEvent<any> = checkEligibilityStrategy.nextCommand(profileSagaState);

    //Assert
    expect(nextCommand).toBeInstanceOf(UpdateProfileStatusCommand);
    expect(nextCommand.props.status).toEqual(ProfileStatus.REJECTED);
    expect(nextCommand['delay']).toEqual({ hours: 1 });
  });
});
