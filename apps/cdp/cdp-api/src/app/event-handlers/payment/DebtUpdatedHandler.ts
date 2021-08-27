import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { DebtUpdated } from '@oney/payment-messages';
import { injectable } from 'inversify';

@injectable()
export class DebtUpdatedHandler extends DomainEventHandler<DebtUpdated> {
  public handle(domainEvent: DebtUpdated): Promise<void> {
    return;
  }
}
