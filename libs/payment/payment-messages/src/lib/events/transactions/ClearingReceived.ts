import { Event, DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';

export interface ClearingReceivedProps {
  details: {
    AccountId: {
      AppAccountId: string;
    };
  };
}

@DecoratedEvent({ version: 1, name: 'CLEARING_RECEIVED', namespace: '@oney/payment' })
export class ClearingReceived implements Event<ClearingReceivedProps> {
  id: string = uuidv4();

  props: ClearingReceivedProps;

  constructor(props: ClearingReceivedProps) {
    this.props = { ...props };
  }
}
