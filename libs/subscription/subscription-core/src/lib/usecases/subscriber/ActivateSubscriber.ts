import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { Subscriber } from '../../domain/aggregates/Subscriber';
import { SubscriberRepository } from '../../domain/repositories/SubscriberRepository';
import { SubscriptionIdentifier } from '../../SubscriptionIdentifier';

export interface ActivateSubscriptionRequest {
  uid: string;
  isValidated: boolean;
}

@injectable()
export class ActivateSubscriber implements Usecase<ActivateSubscriptionRequest, Subscriber> {
  constructor(
    @inject(SubscriptionIdentifier.subscriberRepository)
    private readonly _subscriberRepository: SubscriberRepository,
    @inject(EventProducerDispatcher)
    private readonly _eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: ActivateSubscriptionRequest): Promise<Subscriber> {
    const subscriber = await this._subscriberRepository.getById(request.uid);
    subscriber.activate({
      isValidated: request.isValidated,
    });
    await this._subscriberRepository.save(subscriber);
    await this._eventDispatcher.dispatch(subscriber);
    return subscriber;
  }
}
