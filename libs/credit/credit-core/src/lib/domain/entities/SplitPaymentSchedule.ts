import {
  InitialPaymentSchedule,
  PaymentExecution,
  PaymentStatus,
  ScheduleKey,
  SplitPaymentScheduleCreated,
} from '@oney/credit-messages';
import { AggregateRoot } from '@oney/ddd';
import { DateTime } from 'luxon';
import { SplitPaymentScheduleProperties } from '../types/split/SplitPaymentScheduleProperties';

export class SplitPaymentSchedule extends AggregateRoot<SplitPaymentScheduleProperties> {
  private props: SplitPaymentScheduleProperties;

  get getProps(): SplitPaymentScheduleProperties {
    return this.props;
  }

  constructor(paymentScheduleProps: SplitPaymentScheduleProperties) {
    super(paymentScheduleProps.contractNumber);
    this.props = paymentScheduleProps;
  }

  scheduleFunding(amount: number): void {
    const today = DateTime.utc();
    const fundingExecution = {
      key: ScheduleKey.FUNDING,
      amount,
      dueDate: today.toJSDate(),
      status: PaymentStatus.TODO,
    };
    this.props = { ...this.props, fundingExecution };
  }

  schedulePayments(initialPaymentSchedule: InitialPaymentSchedule): void {
    const { immediatePayments, deferredPayments } = initialPaymentSchedule;
    const paymentSchedule = [...immediatePayments, ...deferredPayments];
    const paymentsExecution = paymentSchedule.map(step => ({
      ...step,
      status: PaymentStatus.TODO,
    }));
    this.props = { ...this.props, paymentsExecution };
  }

  addEvent(): void {
    this.addDomainEvent(new SplitPaymentScheduleCreated(this.props));
  }

  executeScheduleFunding(paymentExecution: PaymentExecution): void {
    this.props.fundingExecution = {
      ...paymentExecution,
      status: PaymentStatus.PAID,
    };
  }

  executeSchedulePayments(paymentExecution: PaymentExecution): void {
    this.props.paymentsExecution = this.props.paymentsExecution.map(pe =>
      pe.key === paymentExecution.key
        ? {
            ...paymentExecution,
            status: PaymentStatus.PAID,
          }
        : pe,
    );
  }
}
