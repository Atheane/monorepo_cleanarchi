import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { SubscriptionIdentifier } from '../../SubscriptionIdentifier';
import { SubscriptionRepository } from '../../domain/repositories/SubscriptionRepository';
import { Subscription } from '../../domain/aggregates/Subscription';

export interface GetSubscriptionsBySubscriberIdRequest {
  subscriberId: string;
}

@injectable()
export class GetSubscriptionsBySubscriberId
  implements Usecase<GetSubscriptionsBySubscriberIdRequest, Subscription[]> {
  constructor(
    @inject(SubscriptionIdentifier.subscriptionRepository)
    private readonly _subscriptionRepository: SubscriptionRepository,
  ) {}

  async execute(request: GetSubscriptionsBySubscriberIdRequest): Promise<Subscription[]> {
    return await this._subscriptionRepository.getBySubscriberId(request.subscriberId);
  }

  async canExecute(identity: Identity, request?: GetSubscriptionsBySubscriberIdRequest): Promise<boolean> {
    const role = identity.roles.find(item => item.scope.name === ServiceName.subscription);
    return role.permissions.read === Authorization.self && identity.uid === request.subscriberId;
  }
}
