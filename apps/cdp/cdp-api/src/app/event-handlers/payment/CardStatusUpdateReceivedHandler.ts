import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { CardStatusUpdateReceived } from '@oney/payment-messages';
import { injectable } from 'inversify';

@injectable()
export class CardStatusUpdateReceivedHandler extends DomainEventHandler<CardStatusUpdateReceived> {
  public handle(domainEvent: CardStatusUpdateReceived): Promise<void> {
    return;
  }
}
