import { ProfileStatus } from '@oney/profile-messages';

export class ActionRequiredIdStrategy {
  static nextStatus(): ProfileStatus {
    return ProfileStatus.ON_HOLD;
  }
}
