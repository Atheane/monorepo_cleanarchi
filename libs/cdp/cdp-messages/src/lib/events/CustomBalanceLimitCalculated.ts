import { DomainEvent } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidV4 } from 'uuid';
import { CdpEventName } from './CdpEventName';

export interface CustomBalanceLimitCalculatedProps {
  uId: string;
  customBalanceLimitEligibility: boolean;
  customBalanceLimit: number;
  verifiedRevenues: number;
}

@DecoratedEvent({ version: 1, name: CdpEventName.CUSTOM_BALANCE_LIMIT_CALCULATED, namespace: '@oney/cdp' })
export class CustomBalanceLimitCalculated implements DomainEvent<CustomBalanceLimitCalculatedProps> {
  readonly id = uuidV4();
  readonly props: CustomBalanceLimitCalculatedProps;

  constructor(props: CustomBalanceLimitCalculatedProps) {
    this.props = { ...props };
  }
}
