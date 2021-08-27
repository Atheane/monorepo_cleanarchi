import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { SctOutExecuted } from '@oney/payment-messages';
import { injectable } from 'inversify';

@injectable()
export class SctOutExecutedHandler extends DomainEventHandler<SctOutExecuted> {
  public handle(domainEvent: SctOutExecuted): Promise<void> {
    return;
  }
}
