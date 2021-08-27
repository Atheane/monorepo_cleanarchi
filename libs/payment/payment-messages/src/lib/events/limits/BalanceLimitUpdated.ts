import { DecoratedEvent } from '@oney/messages-core';
import { DomainEvent } from '@oney/ddd';

export interface BalanceLimitUpdatedProps {
  balanceLimit: number;
}

@DecoratedEvent({ version: 1, name: 'GLOBAL_OUT_UPDATED', namespace: '@oney/payment' })
export class BalanceLimitUpdated implements DomainEvent<BalanceLimitUpdatedProps> {
  id: string;
  props: BalanceLimitUpdatedProps;

  constructor(props: BalanceLimitUpdatedProps) {
    this.props = { ...props };
  }
}
