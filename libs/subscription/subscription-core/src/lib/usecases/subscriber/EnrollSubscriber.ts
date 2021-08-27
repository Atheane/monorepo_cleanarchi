import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { Subscriber } from '../../domain/aggregates/Subscriber';
import { SubscriberRepository } from '../../domain/repositories/SubscriberRepository';
import { SubscriptionIdentifier } from '../../SubscriptionIdentifier';
import { SubscriberErrors } from '../../domain/models/SubscriberErrors';

export interface CreateSubscriberRequest {
  uid: string;
}

@injectable()
export class EnrollSubscriber implements Usecase<CreateSubscriberRequest, void> {
  constructor(
    @inject(SubscriptionIdentifier.subscriberRepository)
    private readonly _subscriberRepository: SubscriberRepository,
    @inject(EventProducerDispatcher)
    private readonly _eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: CreateSubscriberRequest): Promise<void> {
    const result = await this._subscriberRepository.exist(request.uid);
    if (!result) {
      const subscriber = Subscriber.enroll({
        uid: request.uid,
      });
      await this._subscriberRepository.save(subscriber);
      await this._eventDispatcher.dispatch(subscriber);
      return;
    }
    throw new SubscriberErrors.SubscriberAlreadyExist('SUBSCRIBER_ALREADY_EXIST');
  }
}
