import 'reflect-metadata';
import { ProfileStatus, UpdateProfileStatusCommand } from '@oney/profile-messages';
import { DomainEvent } from '@oney/ddd';
import { ProfileSagaState } from '../../../adapters/saga/types/ProfileSagaState';
import { ActionRequiredIdStrategy } from '../../../adapters/saga/profileStatusStrategy/ActionRequiredIdStrategy';

describe('ActionRequiredIdStrategy should return event status', () => {
  const uid = 'beGe_flCm';

  it('ON_HOLD', () => {
    //Arrange
    const actionRequiredIdStrategy = new ActionRequiredIdStrategy();
    const profileSagaState = {
      uid,
      status: ProfileStatus.ACTION_REQUIRED_ID,
    } as ProfileSagaState;

    //Act
    const nextCommand: DomainEvent<any> = actionRequiredIdStrategy.nextCommand(profileSagaState);

    //Assert
    expect(nextCommand).toBeInstanceOf(UpdateProfileStatusCommand);
    expect(nextCommand.props.status).toEqual(ProfileStatus.ON_HOLD);
  });
});
