import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { Subscriber } from '../../domain/aggregates/Subscriber';
import { SubscriberRepository } from '../../domain/repositories/SubscriberRepository';
import { SubscriptionIdentifier } from '../../SubscriptionIdentifier';

export interface GetSubscriberByIdRequest {
  uid: string;
}

@injectable()
export class GetSubscriberById implements Usecase<GetSubscriberByIdRequest, Subscriber> {
  constructor(
    @inject(SubscriptionIdentifier.subscriberRepository)
    private readonly _subscriberRepository: SubscriberRepository,
    @inject(EventProducerDispatcher)
    private readonly _eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: GetSubscriberByIdRequest): Promise<Subscriber> {
    return await this._subscriberRepository.getById(request.uid);
  }
}
