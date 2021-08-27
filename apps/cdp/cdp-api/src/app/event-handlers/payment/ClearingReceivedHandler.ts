import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { ClearingReceived } from '@oney/payment-messages';
import { injectable } from 'inversify';

@injectable()
export class ClearingReceivedHandler extends DomainEventHandler<ClearingReceived> {
  public handle(domainEvent: ClearingReceived): Promise<void> {
    return;
  }
}
