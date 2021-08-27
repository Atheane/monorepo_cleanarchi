import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { CdpEventName } from './CdpEventName';

export interface X3X4EligibilityCalculatedProps {
  uId: string;
  eligibility: boolean;
}

@DecoratedEvent({ name: CdpEventName.X3X4_ELIGIBILITY_CALCULATED, version: 1, namespace: '@oney/cdp' })
export class X3X4EligibilityCalculated implements DomainEvent<X3X4EligibilityCalculatedProps> {
  readonly id = uuidv4();
  readonly props: X3X4EligibilityCalculatedProps;
  readonly metadata?: DomainEventMetadata;

  constructor(props: X3X4EligibilityCalculatedProps) {
    this.props = { ...props };
  }
}
