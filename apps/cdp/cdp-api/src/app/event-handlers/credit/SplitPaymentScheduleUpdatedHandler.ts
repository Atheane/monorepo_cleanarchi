import { GenericError } from '@oney/common-core';
import { SplitPaymentScheduleUpdated } from '@oney/credit-messages';
import { DomainEventHandler } from '@oney/ddd';
import { injectable } from 'inversify';

@injectable()
export class SplitPaymentScheduleUpdatedHandler extends DomainEventHandler<SplitPaymentScheduleUpdated> {
  public handle(domainEvent: SplitPaymentScheduleUpdated): Promise<void> {
    return;
  }
}
