import { DomainEventHandler } from '@oney/ddd';
import { BillPaymentOrdered, SubscriptionStatus } from '@oney/subscription-messages';
import { injectable } from 'inversify';
import {
  CancelSubscriptionByOfferId,
  GetSubscriptionsBySubscriberId,
  UpdateSubscriptionNextBillingDate,
} from '@oney/subscription-core';
//WIP will be handle in another PR with command.
@injectable()
export class BillOrderedHandler extends DomainEventHandler<BillPaymentOrdered> {
  constructor(
    private readonly _cancelSubscription: CancelSubscriptionByOfferId,
    private readonly _getSubscriptionBySubscriberId: GetSubscriptionsBySubscriberId,
    private readonly _updateSubscriptionNextBillingDate: UpdateSubscriptionNextBillingDate,
  ) {
    super();
  }

  async handle(domainEvent: BillPaymentOrdered): Promise<void> {
    const {
      props: { offerId, uid: subscriberId },
    } = domainEvent;
    const subscriptions = await this._getSubscriptionBySubscriberId.execute({
      subscriberId: subscriberId,
    });
    const subscription = subscriptions.find(item => item.props.offerId === offerId);
    const { status } = subscription.props;
    if (status === SubscriptionStatus.PENDING_CANCELLATION) {
      await this._cancelSubscription.execute({
        subscriberId: subscriberId,
        offerId: offerId,
        immediate: true,
      });
      return;
    }
    await this._updateSubscriptionNextBillingDate.execute({
      offerId,
      subscriberId: subscriberId,
    });
    return;
  }
}
