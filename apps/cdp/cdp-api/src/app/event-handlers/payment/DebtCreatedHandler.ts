import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { DebtCreated } from '@oney/payment-messages';
import { injectable } from 'inversify';

@injectable()
export class DebtCreatedHandler extends DomainEventHandler<DebtCreated> {
  public handle(domainEvent: DebtCreated): Promise<void> {
    return;
  }
}
