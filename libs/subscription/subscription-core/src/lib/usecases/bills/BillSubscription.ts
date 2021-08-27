import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { OrderId } from '@oney/common-core';
import { SubscriptionIdentifier } from '../../SubscriptionIdentifier';
import { OfferRepository } from '../../domain/repositories/OfferRepository';
import { SubscriptionRepository } from '../../domain/repositories/SubscriptionRepository';
import { BillingRepository } from '../../domain/repositories/BillingRepository';
import { SubscriberRepository } from '../../..';

export interface BillSubscriptionRequest {
  period: number;
  subscriptionId: string;
}

@injectable()
export class BillSubscription implements Usecase<BillSubscriptionRequest, void> {
  constructor(
    @inject(SubscriptionIdentifier.subscriptionRepository)
    private readonly _subscriptionRepository: SubscriptionRepository,
    @inject(EventProducerDispatcher)
    private readonly _eventDispatcher: EventProducerDispatcher,
    @inject(SubscriptionIdentifier.billingRepository)
    private readonly _billingRepository: BillingRepository,
    @inject(SubscriptionIdentifier.offerRepository)
    private readonly _offerRepository: OfferRepository,
    @inject(SubscriptionIdentifier.subscriberRepository)
    private readonly _subscriberRepository: SubscriberRepository,
  ) {}

  async execute(request: BillSubscriptionRequest): Promise<void> {
    const subscription = await this._subscriptionRepository.getById(request.subscriptionId);
    const subscriber = await this._subscriberRepository.getById(subscription.props.subscriberId);
    const offer = await this._offerRepository.getById(subscription.props.offerId);
    const discountedPrice = offer.discountPrice(subscriber.props.customerType);
    const orderId = new OrderId(5, 6).value;
    const bill = subscription.bill({
      orderId: orderId,
      billPeriod: request.period,
      price: discountedPrice,
      offerRef: offer.props.ref,
    });
    await this._billingRepository.save(bill);
    await this._eventDispatcher.dispatch(bill);
    return;
  }
}
