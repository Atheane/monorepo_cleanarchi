import { AggregateRoot } from '@oney/ddd';
import { PaymentCreated, TransferCreated } from '@oney/payment-messages';
import { CounterParty } from '../valueobjects/CounterParty';
import { Recurrency } from '../valueobjects/Recurrency';
import { Tag } from '../valueobjects/Tag';

export interface TransferProperties {
  beneficiary: CounterParty;
  sender: CounterParty;
  amount: number;
  message: string;
  orderId: string;
  executionDate: Date;
  tag: Tag;
  recurrence?: Recurrency;
  recipientEmail?: string;
}

export class Transfer extends AggregateRoot<TransferProperties> {
  public readonly props: TransferProperties;

  constructor(paymentProps: TransferProperties) {
    super(paymentProps.orderId);
    this.props = paymentProps;
  }

  static createP2P(props: TransferProperties): Transfer {
    const payment = new Transfer(props);
    payment.addDomainEvent(
      new PaymentCreated({
        amount: payment.props.amount,
        beneficiary: payment.props.beneficiary,
        executionDate: payment.props.executionDate,
        message: payment.props.message,
        orderId: payment.props.orderId,
        recurrence: payment.props.recurrence,
        sender: payment.props.sender,
        tag: payment.props.tag,
        id: payment.props.orderId,
      }),
    );
    return payment;
  }

  static makeTransfer(props: TransferProperties): Transfer {
    const transfer = new Transfer(props);
    transfer.addDomainEvent(
      new TransferCreated({
        amount: transfer.props.amount,
        beneficiary: transfer.props.beneficiary,
        executionDate: transfer.props.executionDate,
        id: transfer.props.sender.id,
        message: transfer.props.message,
        orderId: transfer.props.orderId,
        recurrence: transfer.props.recurrence,
        sender: transfer.props.sender,
        recipientEmail: transfer.props.recipientEmail,
      }),
    );
    return transfer;
  }

  hasRecurrence(): boolean {
    return !!this.props.recurrence;
  }
}
