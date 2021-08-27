import { ProfileStatus } from '@oney/profile-messages';

export class ActionRequiredActivateStrategy {
  static nextStatus(): ProfileStatus {
    return ProfileStatus.ACTIVE;
  }
}
