import { SplitPaymentScheduleUpdated } from '@oney/credit-messages';
import { AggregateRoot } from '@oney/ddd';
import { PaymentExecution, PaymentStatus } from '../types';
import { SplitPaymentScheduleProperties } from '../types/SplitPaymentScheduleProperties';

export class SplitPaymentSchedule extends AggregateRoot<SplitPaymentScheduleProperties> {
  public readonly props: SplitPaymentScheduleProperties;
  constructor(paymentScheduleProps: SplitPaymentScheduleProperties) {
    super(paymentScheduleProps.id);
    this.props = paymentScheduleProps;
  }

  updateFundingExecution(fundingExecutionToUpdate: PaymentExecution): void {
    this.props.fundingExecution = fundingExecutionToUpdate;
    this.addDomainEvent(new SplitPaymentScheduleUpdated(this.props));
  }

  updateSomePaymentExecutions(paymentsExecutionToUpdate: PaymentExecution[]): void {
    paymentsExecutionToUpdate.forEach(paymentToUpdate => this.updateOnePaymentExecution(paymentToUpdate));
  }

  updateOnePaymentExecution(paymentsExecutionToUpdate: PaymentExecution): void {
    this.props.paymentsExecution = this.props.paymentsExecution.map(paymentToExecute => {
      if (paymentToExecute.key === paymentsExecutionToUpdate.key) {
        this.addDomainEvent(new SplitPaymentScheduleUpdated(this.props));
        return paymentsExecutionToUpdate;
      }
      return paymentToExecute;
    });
  }
  canFundingBeExecuted(): boolean {
    return this.props.fundingExecution.status === PaymentStatus.TODO;
  }

  getFundingExecution(): PaymentExecution {
    return this.props.fundingExecution;
  }
}
