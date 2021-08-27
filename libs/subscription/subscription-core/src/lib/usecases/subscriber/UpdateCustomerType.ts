import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { CustomerType } from '@oney/subscription-messages';
import { inject, injectable } from 'inversify';
import { Subscriber } from '../../domain/aggregates/Subscriber';
import { SubscriberRepository } from '../../domain/repositories/SubscriberRepository';
import { SubscriptionIdentifier } from '../../SubscriptionIdentifier';

export interface UpdateCustomerTypeRequest {
  uid: string;
  customerType: CustomerType;
}

@injectable()
export class UpdateCustomerType implements Usecase<UpdateCustomerTypeRequest, Subscriber> {
  constructor(
    @inject(SubscriptionIdentifier.subscriberRepository)
    private readonly _subscriberRepository: SubscriberRepository,
    @inject(EventProducerDispatcher)
    private readonly _eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: UpdateCustomerTypeRequest): Promise<Subscriber> {
    const subscriber = await this._subscriberRepository.getById(request.uid);
    subscriber.updateCustomerType(request.customerType);
    await this._subscriberRepository.save(subscriber);
    await this._eventDispatcher.dispatch(subscriber);
    return subscriber;
  }
}
