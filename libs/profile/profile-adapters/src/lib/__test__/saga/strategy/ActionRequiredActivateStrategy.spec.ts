import 'reflect-metadata';
import { ProfileStatus, UpdateProfileStatusCommand } from '@oney/profile-messages';
import { DomainEvent } from '@oney/ddd';
import { ProfileSagaState } from '../../../adapters/saga/types/ProfileSagaState';
import { ActionRequiredActivateStrategy } from '../../../adapters/saga/profileStatusStrategy/ActionRequiredActivateStrategy';

describe('ActionRequiredActivateStrategy should return event status', () => {
  const uid = 'beGe_flCm';

  it('ACTIVE', () => {
    //Arrange
    const actionRequiredActivateStrategy = new ActionRequiredActivateStrategy();
    const profileSagaState = {
      uid,
      status: ProfileStatus.ACTION_REQUIRED_ACTIVATE,
    } as ProfileSagaState;

    //Act
    const nextCommand: DomainEvent<any> = actionRequiredActivateStrategy.nextCommand(profileSagaState);

    //Assert
    expect(nextCommand).toBeInstanceOf(UpdateProfileStatusCommand);
    expect(nextCommand.props.status).toEqual(ProfileStatus.ACTIVE);
  });
});
