import 'reflect-metadata';
import { KycDecisionType, ProfileStatus } from '@oney/profile-messages';
import { LcbFtRiskLevel } from '@oney/payment-messages';
import { UpdateProfileStatusCommand } from '@oney/profile-messages';
import { DomainEvent } from '@oney/ddd';
import { ProfileSagaState } from '../../../adapters/saga/types/ProfileSagaState';
import { CheckRequiredAmlStrategy } from '../../../adapters/saga/profileStatusStrategy/CheckRequiredAmlStrategy';

describe('CheckRequiredAmlStrategy should return event status', () => {
  const uid = 'beGe_flCm';

  it(`ACTION_REQUIRED_TAX_NOTICE when Risk is HIGH`, () => {
    //Arrange
    const checkRequiredAmlStrategy = new CheckRequiredAmlStrategy();
    const profileSagaState = {
      uid,
      status: ProfileStatus.CHECK_REQUIRED_AML,
      risk: LcbFtRiskLevel.HIGH,
    } as ProfileSagaState;

    //Act
    const nextCommand: DomainEvent<any> = checkRequiredAmlStrategy.nextCommand(profileSagaState);

    //Assert
    expect(nextCommand).toBeInstanceOf(UpdateProfileStatusCommand);
    expect(nextCommand.props.status).toEqual(ProfileStatus.ACTION_REQUIRED_TAX_NOTICE);
  });

  [LcbFtRiskLevel.LOW, LcbFtRiskLevel.MEDIUM].map((moneyLaunderingRisk: LcbFtRiskLevel) => {
    it(`CHECK_ELIGIBILITY when Risk is ${moneyLaunderingRisk} and eligibilityReceived is false`, () => {
      //Arrange
      const checkRequiredAmlStrategy = new CheckRequiredAmlStrategy();
      const profileSagaState = {
        uid,
        status: ProfileStatus.CHECK_REQUIRED_AML,
        risk: moneyLaunderingRisk,
      } as ProfileSagaState;

      //Act
      const nextCommand: DomainEvent<any> = checkRequiredAmlStrategy.nextCommand(profileSagaState);

      //Assert
      expect(nextCommand).toBeInstanceOf(UpdateProfileStatusCommand);
      expect(nextCommand.props.status).toEqual(ProfileStatus.CHECK_ELIGIBILITY);
    });
  });

  it(`REJECTED when eligibilityReceived and accountEligibility is false Risk is HIGH`, () => {
    //Arrange
    const checkRequiredAmlStrategy = new CheckRequiredAmlStrategy();
    const profileSagaState = {
      uid,
      status: ProfileStatus.CHECK_REQUIRED_AML,
      eligibilityReceived: true,
      eligibility: { accountEligibility: false },
      scoring: { decision: KycDecisionType.OK },
      risk: LcbFtRiskLevel.HIGH,
    } as ProfileSagaState;

    //Act
    const nextCommand: DomainEvent<any> = checkRequiredAmlStrategy.nextCommand(profileSagaState);

    //Assert
    expect(nextCommand).toBeInstanceOf(UpdateProfileStatusCommand);
    expect(nextCommand.props.status).toEqual(ProfileStatus.REJECTED);
  });
});
