import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { BillSubscription } from './BillSubscription';
import { SubscriptionIdentifier } from '../../SubscriptionIdentifier';
import { OfferRepository } from '../../domain/repositories/OfferRepository';
import { SubscriptionRepository } from '../../domain/repositories/SubscriptionRepository';
import { BillingRepository } from '../../domain/repositories/BillingRepository';

@injectable()
export class BillSubscriptions implements Usecase<void, void> {
  constructor(
    @inject(SubscriptionIdentifier.subscriptionRepository)
    private readonly _subscriptionRepository: SubscriptionRepository,
    @inject(SubscriptionIdentifier.billingRepository)
    private readonly _billingRepository: BillingRepository,
    @inject(SubscriptionIdentifier.offerRepository)
    private readonly _offerRepository: OfferRepository,
    private readonly _billSubscription: BillSubscription,
  ) {}

  async execute(): Promise<void> {
    const subscriptions = await this._subscriptionRepository.getDueSubscriptions();
    if (subscriptions.length > 0) {
      for await (const subscription of subscriptions) {
        const bills = await this._billingRepository.getBySubscriptionId(subscription.id);
        const offer = await this._offerRepository.getById(subscription.props.offerId);
        const paymentDues = subscription.getDuePeriods(bills, offer.props.periodicity);
        if (paymentDues.length > 0) {
          for await (const duePayment of paymentDues) {
            await this._billSubscription.execute({
              period: duePayment,
              subscriptionId: subscription.id,
            });
          }
        }
      }
    }
    return;
  }
}
