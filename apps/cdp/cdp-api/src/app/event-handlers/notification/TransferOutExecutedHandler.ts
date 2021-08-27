import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { TransferOutExecuted } from '@oney/notification-messages';
import { injectable } from 'inversify';

@injectable()
export class TransferOutExecutedHandler extends DomainEventHandler<TransferOutExecuted> {
  public handle(domainEvent: TransferOutExecuted): Promise<void> {
    return;
  }
}
