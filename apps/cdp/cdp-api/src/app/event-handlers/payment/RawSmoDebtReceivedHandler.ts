import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { RawSmoDebtReceived } from '@oney/payment-messages';
import { injectable } from 'inversify';

@injectable()
export class RawSmoDebtReceivedHandler extends DomainEventHandler<RawSmoDebtReceived> {
  public handle(domainEvent: RawSmoDebtReceived): Promise<void> {
    return;
  }
}
