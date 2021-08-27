import { SplitPaymentScheduleCreated } from '@oney/credit-messages';
import { DomainEventHandler } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../../di/Identifiers';
import { GeneratePaymentSchedule } from '../../../usecase/payment_schedule/GeneratePaymentSchedule';

@injectable()
export class PaymentScheduleHandler extends DomainEventHandler<SplitPaymentScheduleCreated> {
  private readonly generatePaymentSchedule: GeneratePaymentSchedule;

  constructor(@inject(Identifiers.GeneratePaymentSchedule) generatePaymentSchedule: GeneratePaymentSchedule) {
    super();
    this.generatePaymentSchedule = generatePaymentSchedule;
  }

  async handle(domainEvent: SplitPaymentScheduleCreated): Promise<void> {
    defaultLogger.info(`Received PAYMENT_SCHEDULE_CREATED event`, domainEvent);
    await this.generatePaymentSchedule.execute(domainEvent.props);
  }
}
