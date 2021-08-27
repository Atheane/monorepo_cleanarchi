import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';

export enum FacematchResult {
  OK = 'ok',
  STOP = 'stop',
  FAILURE = 'failure',
  SKIPPED = 'skipped',
}

export interface UserFacematchValidatedProps {
  result: FacematchResult;
  consent: boolean;
  consentDate: Date;
}

@DecoratedEvent({ version: 1, name: 'USER_FACEMATCH_VALIDATED', namespace: '@oney/profile' })
export class UserFacematchValidated implements DomainEvent<UserFacematchValidatedProps> {
  id: string = uuidv4();

  props: UserFacematchValidatedProps;
  metadata?: DomainEventMetadata;
  constructor(props: UserFacematchValidatedProps) {
    this.props = { ...props };
  }
}
