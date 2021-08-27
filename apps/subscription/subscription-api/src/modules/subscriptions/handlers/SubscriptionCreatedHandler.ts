import { DomainEventHandler } from '@oney/ddd';
import {
  ActivateSubscription,
  CancelSubscriptionByOfferId,
  GetOffers,
  GetSubscriberById,
  SubscriptionErrors,
} from '@oney/subscription-core';
import { OrderCard, SubscriptionCreated } from '@oney/subscription-messages';
import { inject, injectable } from 'inversify';
import { EventDispatcher } from '@oney/messages-core';
import { Logger, SymLogger } from '@oney/logger-core';
import { SubscriptionSyms } from '../../../config/di/SubscriptionSyms';

@injectable()
export class SubscriptionCreatedHandler extends DomainEventHandler<SubscriptionCreated> {
  constructor(
    private readonly activateSubscription: ActivateSubscription,
    private readonly _getSubscriberById: GetSubscriberById,
    private readonly _cancelSubscriptionByOfferId: CancelSubscriptionByOfferId,
    @inject(SubscriptionSyms.defaultOffer) private readonly _defaultOffer: string,
    @inject(EventDispatcher) private readonly _eventDispatcher: EventDispatcher,
    private readonly _getOffers: GetOffers,
    @inject(SymLogger) private readonly _logger: Logger,
  ) {
    super();
  }

  async handle(domainEvent: SubscriptionCreated): Promise<void> {
    const { subscriberId, offerId, offerType } = domainEvent.props;
    if (offerId !== this._defaultOffer) {
      try {
        await this._cancelSubscriptionByOfferId.execute({
          offerId: this._defaultOffer,
          subscriberId: subscriberId,
        });
      } catch (e) {
        /* istanbul ignore next */ //Difficult to track as this is the only error we can throw
        if (
          !(
            e instanceof SubscriptionErrors.SubscriptionAlreadyCancelled ||
            e instanceof SubscriptionErrors.SubscriptionNotFound
          )
        ) {
          throw e;
        }
        this._logger.info('cannot cancelled default subscription', e);
      } finally {
        await this._eventDispatcher.dispatch(
          new OrderCard({
            subscriberId,
            offerType,
          }),
        );
      }
    }
    return;
  }
}
