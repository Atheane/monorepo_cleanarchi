import 'reflect-metadata';
import { ProfileStatus } from '@oney/profile-messages';
import { ActionRequiredIdStrategy } from '../../../services/ProfileStatusStrategy/ActionRequiredIdStrategy';

describe('ActionRequiredIdStrategy should return status', () => {
  it('ON_HOLD', () => {
    //Act
    const nextStatus = ActionRequiredIdStrategy.nextStatus();

    //Assert
    expect(nextStatus).toEqual(ProfileStatus.ON_HOLD);
  });
});
