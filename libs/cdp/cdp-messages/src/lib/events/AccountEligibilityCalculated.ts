import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidV4 } from 'uuid';
import { CdpEventName } from './CdpEventName';

export interface AccountEligibilityCalculatedProps {
  uId: string;
  timestamp: Date;
  eligibility: boolean;
  balanceLimit: number;
}

@DecoratedEvent({ version: 1, name: CdpEventName.ACCOUNT_ELIGIBILITY_CALCULATED, namespace: '@oney/cdp' })
export class AccountEligibilityCalculated implements DomainEvent<AccountEligibilityCalculatedProps> {
  readonly id = uuidV4();
  readonly props: AccountEligibilityCalculatedProps;
  readonly metadata?: DomainEventMetadata;

  constructor(props: AccountEligibilityCalculatedProps) {
    this.props = { ...props };
  }
}
