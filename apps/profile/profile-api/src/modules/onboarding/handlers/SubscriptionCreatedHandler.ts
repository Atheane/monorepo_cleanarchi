import { DomainEventHandler } from '@oney/ddd';
import { SubscriptionCreated } from '@oney/subscription-messages';
import { injectable } from 'inversify';
import { ValidateSubscriptionStep } from '@oney/profile-core';

@injectable()
export class SubscriptionCreatedHandler extends DomainEventHandler<SubscriptionCreated> {
  constructor(private readonly _validateSubscriptionStep: ValidateSubscriptionStep) {
    super();
  }

  async handle(domainEvent: SubscriptionCreated): Promise<void> {
    await this._validateSubscriptionStep.execute({
      uid: domainEvent.props.subscriberId,
    });
    return;
  }
}
