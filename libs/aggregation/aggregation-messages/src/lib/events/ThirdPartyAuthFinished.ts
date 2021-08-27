import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { ConnectionStateEnum } from './types';
import { AggregationEvents } from './AggregationEvents';

export interface ThirdPartyAuthFinishedProps {
  state: ConnectionStateEnum;
  userId: string;
}

@DecoratedEvent({
  name: AggregationEvents.THIRD_PARTY_AUTH_FINISHED,
  version: 1,
  namespace: '@oney/aggregation',
})
export class ThirdPartyAuthFinished implements DomainEvent<ThirdPartyAuthFinishedProps> {
  readonly id = uuidv4();
  readonly props: ThirdPartyAuthFinishedProps;
  readonly metadata: DomainEventMetadata;
  constructor(props: ThirdPartyAuthFinishedProps) {
    this.props = props;
  }
}
