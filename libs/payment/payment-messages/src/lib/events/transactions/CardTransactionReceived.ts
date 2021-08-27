import { Event, DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';

export interface CardTransactionReceivedProps {
  details: {
    AccountId: {
      AppAccountId: string;
    };
  };
  callback: {
    userId: string;
  };
}

@DecoratedEvent({ version: 1, name: 'CARD_TRANSACTION_RECEIVED', namespace: '@oney/payment' })
export class CardTransactionReceived implements Event<CardTransactionReceivedProps> {
  id: string = uuidv4();

  props: CardTransactionReceivedProps;

  constructor(props: CardTransactionReceivedProps) {
    this.props = { ...props };
  }
}
