import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { CardPreferencesUpdated } from '@oney/payment-messages';
import { injectable } from 'inversify';

@injectable()
export class CardPreferencesUpdatedHandler extends DomainEventHandler<CardPreferencesUpdated> {
  public handle(domainEvent: CardPreferencesUpdated): Promise<void> {
    return;
  }
}
