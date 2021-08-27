import { DecoratedEvent } from '@oney/messages-core';
import { DomainEvent } from '@oney/ddd';
import { GlobalLimits } from './GlobalLimits';

export interface GlobalInUpdatedProps {
  globalIn: GlobalLimits;
}

@DecoratedEvent({ version: 1, name: 'GLOBAL_IN_UPDATED', namespace: '@oney/payment' })
export class GlobalInUpdated implements DomainEvent<GlobalInUpdatedProps> {
  id: string;
  props: GlobalInUpdatedProps;

  constructor(props: GlobalInUpdatedProps) {
    this.props = { ...props };
  }
}
