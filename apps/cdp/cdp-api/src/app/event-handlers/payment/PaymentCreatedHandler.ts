import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { PaymentCreated } from '@oney/payment-messages';
import { injectable } from 'inversify';

@injectable()
export class PaymentCreatedHandler extends DomainEventHandler<PaymentCreated> {
  public handle(domainEvent: PaymentCreated): Promise<void> {
    return;
  }
}
