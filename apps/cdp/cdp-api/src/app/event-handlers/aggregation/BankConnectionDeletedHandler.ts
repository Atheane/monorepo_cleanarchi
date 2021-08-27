import { BankConnectionDeleted } from '@oney/aggregation-messages';
import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { injectable } from 'inversify';

@injectable()
export class BankConnectionDeletedHandler extends DomainEventHandler<BankConnectionDeleted> {
  public handle(domainEvent: BankConnectionDeleted): Promise<void> {
    return;
  }
}
