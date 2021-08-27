import { ContractStatus, PaymentDue, SplitContractCreated, SplitProduct } from '@oney/credit-messages';
import { AggregateRoot } from '@oney/ddd';
import { SplitContractProperties } from '../types/split/SplitContractProperties';

export class SplitContract extends AggregateRoot<SplitContractProperties> {
  public readonly props: SplitContractProperties;

  constructor(contractProps: SplitContractProperties) {
    super(contractProps.contractNumber);
    this.props = contractProps;
  }

  static create(props: {
    initialTransactionId: string;
    transactionDate: Date;
    subscriptionDate: Date;
    apr: number;
    productCode: SplitProduct;
    initialPaymentSchedule: { deferredPayments: PaymentDue[]; immediatePayments: PaymentDue[] };
    bankAccountId: string;
    contractNumber: string;
    label: string;
    userId: string;
    status: ContractStatus;
    termsVersion: string;
  }): SplitContract {
    const contract = new SplitContract(props);
    contract.addDomainEvent(new SplitContractCreated(props));
    return contract;
  }
}
