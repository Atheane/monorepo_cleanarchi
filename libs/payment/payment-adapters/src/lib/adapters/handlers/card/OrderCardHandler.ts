import { DomainEventHandler } from '@oney/ddd';
import { OrderCard } from '@oney/subscription-messages';
import { inject, injectable } from 'inversify';
import { CreateCard, IdGenerator, PaymentIdentifier } from '@oney/payment-core';
import { OfferTypeMapper } from '../../mappers/OfferTypeMapper';

@injectable()
export class OrderCardHandler extends DomainEventHandler<OrderCard> {
  constructor(
    private readonly _createCard: CreateCard,
    @inject(PaymentIdentifier.idGenerator) private readonly _idGenerator: IdGenerator,
    private readonly _offerTypeMapper: OfferTypeMapper,
  ) {
    super();
  }

  async handle(domainEvent: OrderCard): Promise<void> {
    const cardType = this._offerTypeMapper.toDomain(domainEvent.props.offerType);
    await this._createCard.execute({
      accountId: domainEvent.props.subscriberId,
      cardType: cardType,
      //!TODO generate with subscriptionId.
      cardId: 'card-' + this._idGenerator.generateUniqueID(),
    });
  }
}
