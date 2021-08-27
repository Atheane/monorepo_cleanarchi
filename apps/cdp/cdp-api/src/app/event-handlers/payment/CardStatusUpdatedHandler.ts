import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { CardStatusUpdated } from '@oney/payment-messages';
import { injectable } from 'inversify';

@injectable()
export class CardStatusUpdatedHandler extends DomainEventHandler<CardStatusUpdated> {
  public handle(domainEvent: CardStatusUpdated): Promise<void> {
    return;
  }
}
