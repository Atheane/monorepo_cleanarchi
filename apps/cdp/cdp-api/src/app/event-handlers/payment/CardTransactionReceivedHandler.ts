import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { CardTransactionReceived } from '@oney/payment-messages';
import { injectable } from 'inversify';

@injectable()
export class CardTransactionReceivedHandler extends DomainEventHandler<CardTransactionReceived> {
  public handle(domainEvent: CardTransactionReceived): Promise<void> {
    return;
  }
}
