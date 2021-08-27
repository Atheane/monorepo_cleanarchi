import { AggregateRoot } from '@oney/ddd';
import { SplitContractClosed } from '@oney/credit-messages';
import { SplitPaymentSchedule } from './SplitPaymentSchedule';
import { ContractStatus } from '../types';
import { SplitContractProperties } from '../types/SplitContractProperties';

export class SplitContract extends AggregateRoot<SplitContractProperties> {
  readonly props: SplitContractProperties;

  constructor(splitContractProperties: SplitContractProperties) {
    super(splitContractProperties.contractNumber);
    this.props = splitContractProperties;
  }

  close(): void {
    this.props.status = ContractStatus.PAID;
    this.addDomainEvent(
      new SplitContractClosed({
        ...this.props,
        finalPaymentSchedule: this.props.finalPaymentSchedule.props,
      }),
    );
  }

  createFinalPaymentSchedule(paymentSchedule: SplitPaymentSchedule): void {
    this.props.finalPaymentSchedule = new SplitPaymentSchedule({
      ...paymentSchedule.props,
      status: ContractStatus.PAID,
    });
  }
}
