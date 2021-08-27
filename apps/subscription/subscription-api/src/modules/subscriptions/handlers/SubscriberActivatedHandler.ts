import { DomainEventHandler } from '@oney/ddd';
import { ActivateSubscription, GetInactiveSubscription } from '@oney/subscription-core';
import { SubscriberActivated } from '@oney/subscription-messages';
import { injectable } from 'inversify';

@injectable()
export class SubscriberActivatedHandler extends DomainEventHandler<SubscriberActivated> {
  constructor(
    private readonly activateSubscription: ActivateSubscription,
    private readonly _getInactiveSubscriptions: GetInactiveSubscription,
  ) {
    super();
  }

  async handle(domainEvent: SubscriberActivated): Promise<void> {
    const subscriptions = await this._getInactiveSubscriptions.execute({
      subscriberId: domainEvent.metadata.aggregateId,
    });
    // Send a command with subscriptionId.
    for await (const subscription of subscriptions) {
      await this.activateSubscription.execute({
        subscriptionId: subscription.props.id,
      });
    }

    return;
  }
}
