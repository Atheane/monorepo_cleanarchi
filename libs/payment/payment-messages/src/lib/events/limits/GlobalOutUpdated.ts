import { DecoratedEvent } from '@oney/messages-core';
import { DomainEvent } from '@oney/ddd';
import { GlobalLimits } from './GlobalLimits';

export interface GlobalOutUpdatedProps {
  globalOut: GlobalLimits;
}

@DecoratedEvent({ version: 1, name: 'GLOBAL_OUT_UPDATED', namespace: '@oney/payment' })
export class GlobalOutUpdated implements DomainEvent<GlobalOutUpdatedProps> {
  id: string;
  props: GlobalOutUpdatedProps;

  constructor(props: GlobalOutUpdatedProps) {
    this.props = { ...props };
  }
}
