import { AggregateRoot, Handle } from '@oney/ddd';
import {
  CustomerType,
  CustomerTypeUpdated,
  SubscriberActivated,
  SubscriberEnrolled,
  SubscriptionStatus,
} from '@oney/subscription-messages';
import { PartialExceptFor } from '@oney/common-core';
import { Subscription } from './Subscription';
import { Offer } from './Offer';
import { SubscriberErrors } from '../../..';

export interface SubscriberProperties {
  uid: string;
  customerType: CustomerType;
  activatedAt?: Date;
}

export class Subscriber extends AggregateRoot<SubscriberProperties> {
  props: SubscriberProperties;

  constructor(props: PartialExceptFor<SubscriberProperties, 'uid'>) {
    super(props.uid);
    this.props = props as SubscriberProperties;
  }

  isValidated(): boolean {
    return this.props.activatedAt != null;
  }

  static enroll(props: { uid: string }): Subscriber {
    const subscriber = new Subscriber({
      uid: props.uid,
      customerType: CustomerType.DEFAULT,
    });
    subscriber.applyChange(
      new SubscriberEnrolled({
        uid: props.uid,
      }),
    );
    return subscriber;
  }

  @Handle(SubscriberEnrolled)
  private applySubscriberEnrolled(event: SubscriberEnrolled): void {
    this.props.uid = event.props.uid;
  }

  updateCustomerType(customerType: CustomerType): this {
    this.applyChange(
      new CustomerTypeUpdated({
        customerType,
      }),
    );
    return this;
  }

  @Handle(CustomerTypeUpdated)
  private applyCustomerTypeUpdated(event: CustomerTypeUpdated): void {
    this.props.customerType = event.props.customerType;
  }

  activate(props: { isValidated: boolean }): this {
    if (this.props.activatedAt) {
      throw new SubscriberErrors.SubscriberAlreadyValidated('SUBSCRIBER_ALREADY_ACTIVE');
    }
    this.applyChange(
      new SubscriberActivated({
        activatedAt: props.isValidated ? new Date() : null,
      }),
    );
    return this;
  }

  @Handle(SubscriberActivated)
  private applySubscriberActivated(event: SubscriberActivated): void {
    this.props.activatedAt = event.props.activatedAt;
  }

  subscribe(offer: Offer): Subscription {
    const subscription = Subscription.create({
      subscriberId: this.props.uid,
      offerId: offer.id,
      ...(offer.props.type && {
        offerType: offer.props.type,
      }),
      status: this.props.activatedAt ? SubscriptionStatus.ACTIVE : SubscriptionStatus.PENDING_ACTIVATION,
    });
    if (subscription.props.status === SubscriptionStatus.ACTIVE) {
      subscription.activate(offer);
    }
    return subscription;
  }
}
