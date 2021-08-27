import 'reflect-metadata';
import { ProfileStatus } from '@oney/profile-messages';
import { ActionRequiredActivateStrategy } from '../../../services/ProfileStatusStrategy/ActionRequiredActivateStrategy';

describe('ActionRequiredActivateStrategy should return status', () => {
  it('ACTIVE', () => {
    //Act
    const nextStatus = ActionRequiredActivateStrategy.nextStatus();

    //Assert
    expect(nextStatus).toEqual(ProfileStatus.ACTIVE);
  });
});
