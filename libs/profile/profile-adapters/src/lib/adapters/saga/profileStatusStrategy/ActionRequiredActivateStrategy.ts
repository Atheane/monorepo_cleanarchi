import { DomainEvent } from '@oney/ddd';
import { ProfileStatus, UpdateProfileStatusCommand } from '@oney/profile-messages';
import { CommandStrategy } from './CommandStrategy';
import { ProfileSagaState } from '../types/ProfileSagaState';

export class ActionRequiredActivateStrategy implements CommandStrategy<ProfileSagaState> {
  nextCommand(sagaState: ProfileSagaState): DomainEvent {
    const nextCommand = new UpdateProfileStatusCommand({
      uid: sagaState.uid,
      status: ProfileStatus.ACTIVE,
    });

    return nextCommand;
  }
}
