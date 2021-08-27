import 'reflect-metadata';
import { KycDecisionType, KycFraudType } from '@oney/profile-core';
import { ProfileStatus, UpdateProfileStatusCommand } from '@oney/profile-messages';
import { LcbFtRiskLevel } from '@oney/payment-messages';
import { DomainEvent } from '@oney/ddd';
import { ProfileSagaState } from '../../../adapters/saga/types/ProfileSagaState';
import { Scoring } from '../../../adapters/saga/types/Scoring';
import { OnBoardingStrategy } from '../../../adapters/saga/profileStatusStrategy/OnBoardingStrategy';

describe('OnBoardingStrategy should return event status', () => {
  const uid = 'beGe_flCm';

  it('ON_HOLD when scoring decision is PENDING_REVIEW', () => {
    //Arrange
    const onBoardingStrategy = new OnBoardingStrategy();
    const profileSagaState = {
      uid,
      status: ProfileStatus.ON_BOARDING,
      eligibility: undefined,
      amlReceived: false,
      risk: undefined,
      eligibilityReceived: false,
      scoring: { decision: KycDecisionType.PENDING_REVIEW } as Scoring,
    } as ProfileSagaState;

    //Act
    const nextCommand: DomainEvent<any> = onBoardingStrategy.nextCommand(profileSagaState);

    //Assert
    expect(nextCommand).toBeInstanceOf(UpdateProfileStatusCommand);
    expect(nextCommand.props.status).toEqual(ProfileStatus.ON_HOLD);
  });

  it('ACTION_REQUIRED_TAX_NOTICE when scoring decision is PENDING_ADDITIONAL_INFO & fraud risk is RISK_MEDIUM', () => {
    //Arrange
    const onBoardingStrategy = new OnBoardingStrategy();
    const profileSagaState = {
      uid,
      status: ProfileStatus.ON_BOARDING,
      eligibility: undefined,
      amlReceived: false,
      risk: undefined,
      eligibilityReceived: false,
      scoring: {
        decision: KycDecisionType.PENDING_ADDITIONAL_INFO,
        fraud: KycFraudType.RISK_MEDIUM,
      } as Scoring,
    } as ProfileSagaState;

    //Act
    const nextCommand: DomainEvent<any> = onBoardingStrategy.nextCommand(profileSagaState);

    //Assert
    expect(nextCommand).toBeInstanceOf(UpdateProfileStatusCommand);
    expect(nextCommand.props.status).toEqual(ProfileStatus.ACTION_REQUIRED_TAX_NOTICE);
  });

  it('ACTION_REQUIRED_TAX_NOTICE when scoring decision is OK Risk is High and amlReceived', () => {
    //Arrange
    const onBoardingStrategy = new OnBoardingStrategy();
    const profileSagaState = {
      uid,
      status: ProfileStatus.ON_BOARDING,
      amlReceived: true,
      risk: LcbFtRiskLevel.HIGH,
      scoring: {
        decision: KycDecisionType.OK,
      } as Scoring,
    } as ProfileSagaState;

    //Act
    const nextCommand: DomainEvent<any> = onBoardingStrategy.nextCommand(profileSagaState);

    //Assert
    expect(nextCommand).toBeInstanceOf(UpdateProfileStatusCommand);
    expect(nextCommand.props.status).toEqual(ProfileStatus.ACTION_REQUIRED_TAX_NOTICE);
  });

  [KycFraudType.RISK_LOW, KycFraudType.RISK_HIGH].map((fraud: KycFraudType) => {
    it(`ACTION_REQUIRED_ID when scoring decision is PENDING_ADDITIONAL_INFO & fraud risk is ${fraud} & compliance is PENDING_CLIENT`, () => {
      //Arrange
      const onBoardingStrategy = new OnBoardingStrategy();
      const profileSagaState = {
        uid,
        status: ProfileStatus.ON_BOARDING,
        eligibility: undefined,
        amlReceived: false,
        risk: undefined,
        eligibilityReceived: false,
        scoring: {
          decision: KycDecisionType.PENDING_ADDITIONAL_INFO,
          fraud: fraud,
          compliance: KycDecisionType.PENDING_CLIENT,
        } as Scoring,
      } as ProfileSagaState;

      //Act
      const nextCommand: DomainEvent<any> = onBoardingStrategy.nextCommand(profileSagaState);

      //Assert
      expect(nextCommand).toBeInstanceOf(UpdateProfileStatusCommand);
      expect(nextCommand.props.status).toEqual(ProfileStatus.ACTION_REQUIRED_ID);
    });
  });

  it('CHECK_REQUIRED_AML when scoring decision is OK and amlReceived is false', () => {
    //Arrange
    const onBoardingStrategy = new OnBoardingStrategy();
    const profileSagaState = {
      uid,
      status: ProfileStatus.ON_BOARDING,
      amlReceived: false,
      scoring: { decision: KycDecisionType.OK } as Scoring,
    } as ProfileSagaState;

    //Act
    const nextCommand: DomainEvent<any> = onBoardingStrategy.nextCommand(profileSagaState);

    //Assert
    expect(nextCommand).toBeInstanceOf(UpdateProfileStatusCommand);
    expect(nextCommand.props.status).toEqual(ProfileStatus.CHECK_REQUIRED_AML);
  });
});
