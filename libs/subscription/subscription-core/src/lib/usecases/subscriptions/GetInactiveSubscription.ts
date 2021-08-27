import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { SubscriptionIdentifier } from '../../SubscriptionIdentifier';
import { SubscriptionRepository } from '../../domain/repositories/SubscriptionRepository';
import { Subscription } from '../../domain/aggregates/Subscription';

export interface GetInactiveSubscriptionRequest {
  subscriberId: string;
}

@injectable()
export class GetInactiveSubscription implements Usecase<GetInactiveSubscriptionRequest, Subscription[]> {
  constructor(
    @inject(SubscriptionIdentifier.subscriptionRepository)
    private readonly _subscriptionRepository: SubscriptionRepository,
  ) {}

  async execute(request: GetInactiveSubscriptionRequest): Promise<Subscription[]> {
    return await this._subscriptionRepository.getInactiveSubscription(request.subscriberId);
  }
}
