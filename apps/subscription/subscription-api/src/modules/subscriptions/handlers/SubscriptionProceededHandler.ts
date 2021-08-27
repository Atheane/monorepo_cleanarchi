import { DomainEventHandler } from '@oney/ddd';
import { AttachCard } from '@oney/subscription-messages';
import { ProcessSubscription } from '@oney/subscription-core';
import { injectable } from 'inversify';

@injectable()
export class SubscriptionProceededHandler extends DomainEventHandler<AttachCard> {
  constructor(private readonly _processSubscription: ProcessSubscription) {
    super();
  }

  async handle(domainEvent: AttachCard): Promise<void> {
    const { subscriptionId, cardId } = domainEvent.props;
    return await this._processSubscription.execute({
      cardId,
      subscriptionId,
    });
  }
}
