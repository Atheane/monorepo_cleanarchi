import { BankConnectionUpdated } from '@oney/aggregation-messages';
import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { injectable } from 'inversify';

@injectable()
export class BankConnectionUpdatedHandler extends DomainEventHandler<BankConnectionUpdated> {
  public handle(domainEvent: BankConnectionUpdated): Promise<void> {
    return;
  }
}
