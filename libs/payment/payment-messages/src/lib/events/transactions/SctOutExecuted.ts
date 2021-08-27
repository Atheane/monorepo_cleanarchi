import { Event, DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';

export interface SctOutExecutedProps {
  details: {
    AccountId: {
      AppAccountId: string;
    };
  };
}

@DecoratedEvent({ version: 1, name: 'SCT_OUT_EXECUTED', namespace: '@oney/payment' })
export class SctOutExecuted implements Event<SctOutExecutedProps> {
  id: string = uuidv4();

  props: SctOutExecutedProps;

  constructor(props: SctOutExecutedProps) {
    this.props = { ...props };
  }
}
