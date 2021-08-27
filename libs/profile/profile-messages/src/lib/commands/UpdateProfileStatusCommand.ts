import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { v4 as uuidv4 } from 'uuid';
import { DecoratedEvent } from '@oney/messages-core';
import { ProfileStatus } from '../events/types/ProfileStatus';

export interface Delay {
  hours: number;
}

export interface UpdateProfileStatusProps {
  uid: string;
  status: ProfileStatus;
}

@DecoratedEvent({ name: 'UPDATE_PROFILE_STATUS_COMMAND', version: 1 })
export class UpdateProfileStatusCommand implements DomainEvent<UpdateProfileStatusProps> {
  id = uuidv4();
  props: UpdateProfileStatusProps;
  metadata: DomainEventMetadata;
  delay?: Delay;

  constructor(props: UpdateProfileStatusProps, delay?: Delay) {
    this.props = props;
    this.delay = delay;
  }
}
