import {
  Handle,
  Saga,
  SagaExecutionContext,
  SagaPropertyMapper,
  SagaState,
  SagaWorkflow,
  StartedBy,
} from '@oney/saga-core';
import { AttachCard, OfferType, OrderCard, SubscriptionCreated } from '@oney/subscription-messages';
import { inject } from 'inversify';
import { BankAccountOpened, CardCreated } from '@oney/payment-messages';
import { delay } from '@oney/common-core';
import { SubscriptionSyms } from '../../../config/di/SubscriptionSyms';

export interface OfferSubscribedSagasState extends SagaState {
  subscriberId: string;
  subscriptionId: string;
  offerType: OfferType;
}

@Saga({ id: 'offer-subscribed', namespace: '@oney/subscription', version: 0 })
export class OfferSubscribedSagas extends SagaWorkflow<OfferSubscribedSagasState> {
  public id: string;
  public version: number;

  constructor(
    @inject(SubscriptionSyms.defaultOffer) private readonly _defaultOffer: string,
    @inject(SubscriptionSyms.sagaDelayBeforeDispatch) private readonly _delayBeforeDispatch: number,
  ) {
    super();
  }

  protected configureHowToFindSaga(mapper: SagaPropertyMapper<OfferSubscribedSagasState>): void {
    // We start and map subscriberId cause a subscriber cannot have two subscription with same offer.
    mapper
      .configureMapping(SubscriptionCreated)
      .fromEvent(message => message.props.subscriberId)
      .toSaga(sagaData => sagaData.subscriberId);

    mapper
      .configureMapping(BankAccountOpened)
      .fromEvent(message => message.props.uid)
      .toSaga(sagaData => sagaData.subscriberId);

    mapper
      .configureMapping(CardCreated)
      .fromEvent(message => message.props.ownerId)
      .toSaga(sagaData => sagaData.subscriberId);
  }

  @StartedBy(SubscriptionCreated)
  async handleSubscriptionCreated(event: SubscriptionCreated) {
    const { subscriberId, subscriptionId, offerId, offerType } = event.props;
    if (offerId === this._defaultOffer) {
      return this.markAsComplete();
    }
    this.state.subscriptionId = subscriptionId;
    this.state.subscriberId = subscriberId;
    this.state.offerType = offerType;
    return;
  }

  @Handle(BankAccountOpened)
  async handleBankAccountOpened(
    event: BankAccountOpened,
    context: SagaExecutionContext<OfferSubscribedSagasState>,
  ) {
    const { offerType, subscriberId } = this.state;
    await delay(this._delayBeforeDispatch);
    // Because smoney issue when ms between create account and order card is too short.
    await context.eventDispatcher.dispatch(
      new OrderCard({
        offerType,
        subscriberId,
      }),
    );
  }

  // Card Order can be dispatch outside this saga (POSTONBOARDING Scenario).
  @Handle(CardCreated)
  async handleCardOrderedSucceed(
    event: CardCreated,
    context: SagaExecutionContext<OfferSubscribedSagasState>,
  ) {
    await context.eventDispatcher.dispatch(
      new AttachCard({
        cardId: event.props.id,
        subscriptionId: this.state.subscriptionId,
      }),
    );
    this.markAsComplete();
  }
}
