import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { TransferCreated } from '@oney/payment-messages';
import { injectable } from 'inversify';

@injectable()
export class TransferCreatedHandler extends DomainEventHandler<TransferCreated> {
  public handle(domainEvent: TransferCreated): Promise<void> {
    return;
  }
}
