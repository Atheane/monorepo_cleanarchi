import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { CardSent } from '@oney/payment-messages';
import { injectable } from 'inversify';

@injectable()
export class CardSentHandler extends DomainEventHandler<CardSent> {
  public handle(domainEvent: CardSent): Promise<void> {
    return;
  }
}
