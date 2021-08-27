import 'reflect-metadata';
import { KycDecisionType, KycFraudType } from '@oney/profile-core';
import { ProfileStatus, UpdateProfileStatusCommand } from '@oney/profile-messages';
import { LcbFtRiskLevel } from '@oney/payment-messages';
import { DomainEvent } from '@oney/ddd';
import { Scoring } from '../../../adapters/saga/types/Scoring';
import { ProfileSagaState } from '../../../adapters/saga/types/ProfileSagaState';
import { OnHoldStrategy } from '../../../adapters/saga/profileStatusStrategy/OnHoldStrategy';

describe('OnHoldStrategy should return event status', () => {
  const uid = 'beGe_flCm';

  [KycDecisionType.KO_MANUAL, KycDecisionType.OK_MANUAL].map((decision: KycDecisionType) => {
    it(`CHECK_REQUIRED_AML when scoring decision is ${decision} and amlReceived is false`, () => {
      //Arrange
      const onHoldStrategy = new OnHoldStrategy();
      const profileSagaState = {
        uid,
        status: ProfileStatus.ON_HOLD,
        amlReceived: false,
        scoring: { decision: decision } as Scoring,
      } as ProfileSagaState;

      //Act
      const nextCommand: DomainEvent<any> = onHoldStrategy.nextCommand(profileSagaState);

      //Assert
      expect(nextCommand).toBeInstanceOf(UpdateProfileStatusCommand);
      expect(nextCommand.props.status).toEqual(ProfileStatus.CHECK_REQUIRED_AML);
    });
  });

  [KycDecisionType.KO_MANUAL, KycDecisionType.OK_MANUAL].map((decision: KycDecisionType) => {
    it(`ACTION_REQUIRED_TAX_NOTICE when scoring decision is ${decision} and amlReceived is true and Risk is HIGH`, () => {
      //Arrange
      const onHoldStrategy = new OnHoldStrategy();
      const profileSagaState = {
        uid,
        status: ProfileStatus.ON_HOLD,
        amlReceived: true,
        risk: LcbFtRiskLevel.HIGH,
        scoring: { decision: decision } as Scoring,
      } as ProfileSagaState;

      //Act
      const nextCommand: DomainEvent<any> = onHoldStrategy.nextCommand(profileSagaState);

      //Assert
      expect(nextCommand).toBeInstanceOf(UpdateProfileStatusCommand);
      expect(nextCommand.props.status).toEqual(ProfileStatus.ACTION_REQUIRED_TAX_NOTICE);
    });
  });

  [KycDecisionType.KO, KycDecisionType.PENDING_CLIENT, KycDecisionType.NOT_ELIGIBLE].map(
    (decision: KycDecisionType) => {
      it(`ACTION_REQUIRED_TAX_NOTICE when scoring decision is ${decision}`, () => {
        //Arrange
        const onHoldStrategy = new OnHoldStrategy();
        const profileSagaState = {
          uid,
          status: ProfileStatus.ON_HOLD,
          amlReceived: false,
          risk: LcbFtRiskLevel.LOW,
          scoring: { decision: decision } as Scoring,
        } as ProfileSagaState;

        //Act
        const nextCommand: DomainEvent<any> = onHoldStrategy.nextCommand(profileSagaState);

        //Assert
        expect(nextCommand).toBeInstanceOf(UpdateProfileStatusCommand);
        expect(nextCommand.props.status).toEqual(ProfileStatus.ACTION_REQUIRED_TAX_NOTICE);
      });
    },
  );

  it('ACTION_REQUIRED_TAX_NOTICE when Scoring decision is PENDING_ADDITIONAL_INFO & fraud risk is RISK_MEDIUM', () => {
    //Arrange
    const onHoldStrategy = new OnHoldStrategy();
    const profileSagaState = {
      uid,
      status: ProfileStatus.ON_HOLD,
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
    const nextCommand: DomainEvent<any> = onHoldStrategy.nextCommand(profileSagaState);

    //Assert
    expect(nextCommand).toBeInstanceOf(UpdateProfileStatusCommand);
    expect(nextCommand.props.status).toEqual(ProfileStatus.ACTION_REQUIRED_TAX_NOTICE);
  });

  [KycFraudType.RISK_LOW, KycFraudType.RISK_HIGH].map((fraud: KycFraudType) => {
    it(`ACTION_REQUIRED_ID when Scoring decision is PENDING_ADDITIONAL_INFO & fraud risk is ${fraud} & compliance is PENDING_CLIENT`, () => {
      //Arrange
      const onHoldStrategy = new OnHoldStrategy();
      const profileSagaState = {
        uid,
        status: ProfileStatus.ON_HOLD,
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
      const nextCommand: DomainEvent<any> = onHoldStrategy.nextCommand(profileSagaState);

      //Assert
      expect(nextCommand).toBeInstanceOf(UpdateProfileStatusCommand);
      expect(nextCommand.props.status).toEqual(ProfileStatus.ACTION_REQUIRED_ID);
    });
  });
});
