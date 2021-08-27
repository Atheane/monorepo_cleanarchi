import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { CardCreated } from '@oney/payment-messages';
import { injectable } from 'inversify';

@injectable()
export class CardCreatedHandler extends DomainEventHandler<CardCreated> {
  public handle(domainEvent: CardCreated): Promise<void> {
    return;
  }
}
