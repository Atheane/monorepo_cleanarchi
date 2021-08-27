import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { SubscriptionIdentifier } from '../../SubscriptionIdentifier';
import { SubscriptionRepository } from '../../domain/repositories/SubscriptionRepository';
import { Subscription } from '../../domain/aggregates/Subscription';

export interface GetSubscriptionByCardIdRequest {
  cardId: string;
}

@injectable()
export class GetSubscriptionByCardId implements Usecase<GetSubscriptionByCardIdRequest, Subscription> {
  constructor(
    @inject(SubscriptionIdentifier.subscriptionRepository)
    private readonly _subscriptionRepository: SubscriptionRepository,
  ) {}

  async execute(request: GetSubscriptionByCardIdRequest): Promise<Subscription> {
    return await this._subscriptionRepository.getByCardId(request.cardId);
  }
}
