import { GenericError } from '@oney/common-core';
import { SplitPaymentScheduleCreated } from '@oney/credit-messages';
import { DomainEventHandler } from '@oney/ddd';
import { injectable } from 'inversify';

@injectable()
export class SplitPaymentScheduleCreatedHandler extends DomainEventHandler<SplitPaymentScheduleCreated> {
  public handle(domainEvent: SplitPaymentScheduleCreated): Promise<void> {
    return;
  }
}
