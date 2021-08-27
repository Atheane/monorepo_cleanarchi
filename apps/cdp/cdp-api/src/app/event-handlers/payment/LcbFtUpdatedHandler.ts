import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { LcbFtUpdated } from '@oney/payment-messages';
import { injectable } from 'inversify';

@injectable()
export class LcbFtUpdatedHandler extends DomainEventHandler<LcbFtUpdated> {
  public handle(domainEvent: LcbFtUpdated): Promise<void> {
    return;
  }
}
