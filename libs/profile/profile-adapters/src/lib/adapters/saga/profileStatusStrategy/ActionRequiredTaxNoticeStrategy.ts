import { DomainEvent } from '@oney/ddd';
import { KycDecisionType } from '@oney/profile-core';
import { ProfileStatus } from '@oney/profile-messages';
import { UpdateProfileStatusCommand } from '@oney/profile-messages';
import { CommandStrategy } from './CommandStrategy';
import { ProfileSagaState } from '../types/ProfileSagaState';

export class ActionRequiredTaxNoticeStrategy implements CommandStrategy<ProfileSagaState> {
  nextCommand(sagaState: ProfileSagaState): DomainEvent {
    let nextCommand;
    if (sagaState.scoring.compliance === KycDecisionType.PENDING_CLIENT) {
      nextCommand = new UpdateProfileStatusCommand({
        uid: sagaState.uid,
        status: ProfileStatus.ACTION_REQUIRED_ID,
      });
    } else {
      nextCommand = new UpdateProfileStatusCommand({
        uid: sagaState.uid,
        status: ProfileStatus.ON_HOLD,
      });
    }
    return nextCommand;
  }
}
