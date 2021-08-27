import { AggregateRoot, Handle } from '@oney/ddd';
import {
  CardAttached,
  OfferRef,
  Periodicity,
  SubscriptionActivated,
  SubscriptionCancelled,
  SubscriptionCreated,
  SubscriptionInsured,
  SubscriptionNextBillingDateUpdated,
  SubscriptionStatus,
  SubscriptionStatusUpdated,
} from '@oney/subscription-messages';
import { PartialExceptFor } from '@oney/common-core';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';
import { Offer } from './Offer';
import { Bill } from './Bill';
import { DuePeriods } from '../valueObjects/DuePeriods';
import { NextBillingDate } from '../valueObjects/NextBillingDate';
import { OfferSubcriber, SubscriptionErrors } from '../../..';
import { Price } from '../valueObjects/Price';

export interface SubscriptionProperties {
  id: string;
  subscriberId: string;
  offerId: string;
  activationDate?: Date;
  nextBillingDate?: Date;
  cardId?: string;
  endDate?: Date;
  status: SubscriptionStatus;
  insuranceMembershipId?: string;
}

export class Subscription extends AggregateRoot<SubscriptionProperties> {
  props: SubscriptionProperties;

  constructor(props: PartialExceptFor<SubscriptionProperties, 'id'>) {
    super(props.id);
    this.props = props as SubscriptionProperties;
  }

  getDuePeriods(bill: Bill[], periodicity: Periodicity): number[] {
    return new DuePeriods().calculate(
      this.props.activationDate,
      bill.map(item => item.props.period),
      periodicity,
    );
  }

  private canLegallyCancel(): boolean {
    if (!this.props.activationDate) {
      return true;
    }
    const wasLegalRetract = moment().diff(this.props.activationDate, 'days', true) < 14;
    return wasLegalRetract;
  }

  bill(params: { orderId: string; billPeriod: number; price: Price; offerRef: OfferRef }): Bill {
    return Bill.schedule({
      offerId: this.props.offerId,
      subscriptionId: this.props.id,
      amount: Price.calculateProrata(params.price.amount, this.props.endDate).amount,
      orderId: params.orderId,
      period: params.billPeriod,
      uid: this.props.subscriberId,
      scheduleAt: new Date(),
      ref: params.offerRef,
    });
  }

  static create(props: OfferSubcriber): Subscription {
    const subscription = new Subscription({
      subscriberId: props.subscriberId,
      id: uuidv4(),
      offerId: props.offerId,
    });
    subscription.applyChange(
      new SubscriptionCreated({
        offerId: subscription.props.offerId,
        subscriptionId: subscription.props.id,
        subscriberId: subscription.props.subscriberId,
        ...(props.offerType && {
          offerType: props.offerType,
        }),
        status: props.status,
      }),
    );
    return subscription;
  }

  @Handle(SubscriptionCreated)
  private applySubscriptionCreated(event: SubscriptionCreated): void {
    this.props.offerId = event.props.offerId;
    this.props.id = event.props.subscriptionId;
    this.props.subscriberId = event.props.subscriberId;
    this.props.status = event.props.status;
  }

  activate(offer: Offer): this {
    if (this.props.activationDate) {
      throw new SubscriptionErrors.SubscriptionAlreadyValidated('SUBSCRIPTION_ALREADY_ACTIVE');
    }
    if (offer.id !== this.props.offerId) {
      throw new SubscriptionErrors.SubscriptionActivationError(
        'OFFER_TO_ACTIVATE_DOES_NOT_MATCH_OFFER_SUBSCRIBED',
      );
    }
    this.applyChange(
      new SubscriptionActivated({
        subscriberId: this.props.subscriberId,
        nextBillingDate: NextBillingDate.calculate(offer.props.periodicity, new Date()),
        status: SubscriptionStatus.ACTIVE,
      }),
    );
    return this;
  }
  @Handle(SubscriptionActivated)
  private applySubscriptionActivated(event: SubscriptionActivated): void {
    this.props.nextBillingDate = event.props.nextBillingDate;
    this.props.status = event.props.status;
    this.props.activationDate = event.createdAt;
  }

  attachCard(props: { cardId: string }): this {
    this.applyChange(
      new CardAttached({
        cardId: props.cardId,
        offerId: this.props.offerId,
        subscriberId: this.props.subscriberId,
      }),
    );
    return this;
  }

  @Handle(CardAttached)
  private applyCardAttached(event: CardAttached) {
    this.props.cardId = event.props.cardId;
  }

  cancel(immediate = false): this {
    const canCancel = immediate || this.canLegallyCancel();
    if (this.props.endDate && this.props.status === SubscriptionStatus.CANCELLED) {
      throw new SubscriptionErrors.SubscriptionAlreadyCancelled('SUBSCRIPTION_ALREADY_CANCELLED');
    }
    if (canCancel) {
      this.applyChange(
        new SubscriptionCancelled({
          subscriberId: this.props.subscriberId,
          offerId: this.props.offerId,
          status: SubscriptionStatus.CANCELLED,
        }),
      );
    } else {
      this.applyChange(
        new SubscriptionStatusUpdated({
          offerId: this.props.offerId,
          status: SubscriptionStatus.PENDING_CANCELLATION,
          subscriberId: this.props.subscriberId,
        }),
      );
    }
    return this;
  }

  @Handle(SubscriptionStatusUpdated)
  private applySubscriptionStatusUpdated(event: SubscriptionStatusUpdated) {
    this.props.status = event.props.status;
    if (event.props.status === SubscriptionStatus.PENDING_CANCELLATION) {
      this.props.endDate = event.createdAt;
    }
  }

  @Handle(SubscriptionCancelled)
  private applySubscriptionCancelled(event: SubscriptionCancelled) {
    this.props.endDate = event.createdAt;
    this.props.status = event.props.status;
  }

  updateStatus(props: { status: SubscriptionStatus }): this {
    this.applyChange(
      new SubscriptionStatusUpdated({
        offerId: this.props.offerId,
        status: props.status,
        subscriberId: this.props.subscriberId,
      }),
    );
    return this;
  }

  updateNextBillingDate(props: { offer: Offer }): this {
    const offer = props.offer;
    this.applyChange(
      new SubscriptionNextBillingDateUpdated({
        nextBillingDate: NextBillingDate.calculate(offer.props.periodicity, this.props.nextBillingDate),
        offerId: offer.id,
        subscriberId: this.props.subscriberId,
      }),
    );
    return this;
  }

  @Handle(SubscriptionNextBillingDateUpdated)
  private applyNextBillingDateUpdated(event: SubscriptionNextBillingDateUpdated) {
    this.props.nextBillingDate = event.props.nextBillingDate;
  }
  createInsuranceMembership(insuranceMembershipId: string): this {
    this.applyChange(
      new SubscriptionInsured({
        insuranceMembershipId,
      }),
    );
    return this;
  }

  @Handle(SubscriptionInsured)
  private applyCreatedInsuranceMembership(event: SubscriptionInsured): void {
    this.props.insuranceMembershipId = event.props.insuranceMembershipId;
  }
}
