import { AggregateRoot, Handle } from '@oney/ddd';
import { BillScheduled, BillPaymentOrdered, OfferRef } from '@oney/subscription-messages';
import { PartialExceptFor } from '@oney/common-core';

export interface BillProperties {
  uid: string;
  subscriptionId: string;
  offerId: string;
  orderId: string;
  payedAt?: Date;
  billedAt: Date;
  ref: OfferRef;
  period: number;
  amount: number;
}

export class Bill extends AggregateRoot<BillProperties> {
  props: BillProperties;

  constructor(props: PartialExceptFor<BillProperties, 'uid'>) {
    super(props.orderId);
    this.props = props as BillProperties;
  }

  static schedule(props: {
    offerId: string;
    orderId: string;
    subscriptionId: string;
    scheduleAt: Date;
    uid: string;
    period: number;
    amount: number;
    ref: OfferRef;
  }): Bill {
    const bill = new Bill({
      uid: props.uid,
      subscriptionId: props.subscriptionId,
      billedAt: props.scheduleAt,
      offerId: props.offerId,
      orderId: props.orderId,
    });
    bill.applyChange(
      new BillScheduled({
        billedAt: props.scheduleAt,
        subscriptionId: props.subscriptionId,
        offerId: props.offerId,
        uid: props.uid,
        orderId: props.orderId,
        index: props.period,
        amount: props.amount,
        ref: props.ref,
      }),
    );
    return bill;
  }

  @Handle(BillScheduled)
  private applyBillScheduled(event: BillScheduled): void {
    this.props.offerId = event.props.offerId;
    this.props.subscriptionId = event.props.subscriptionId;
    this.props.billedAt = event.props.billedAt;
    this.props.orderId = event.props.orderId;
    this.props.uid = event.props.uid;
    this.props.period = event.props.index;
    this.props.amount = event.props.amount;
    this.props.ref = event.props.ref;
  }

  pay(): this {
    this.applyChange(
      new BillPaymentOrdered({
        offerId: this.props.offerId,
        uid: this.props.uid,
        amount: this.props.amount,
        orderId: this.props.orderId,
      }),
    );
    return this;
  }

  @Handle(BillPaymentOrdered)
  private applyBillPaid(event: BillPaymentOrdered) {
    this.props.payedAt = event.createdAt;
  }
}
