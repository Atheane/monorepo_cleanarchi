import { DomainEvent } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { CdpEventName } from './CdpEventName';

export interface PreEligibilityOKProps {
  uId: string;
  timestamp: Date;
}

@DecoratedEvent({ name: CdpEventName.PRE_ELIGIBILITY_OK, version: 1, namespace: '@oney/cdp' })
export class PreEligibilityOK implements DomainEvent<PreEligibilityOKProps> {
  readonly id = uuidv4();
  readonly props: PreEligibilityOKProps;

  constructor(props: PreEligibilityOKProps) {
    this.props = { ...props };
  }
}
