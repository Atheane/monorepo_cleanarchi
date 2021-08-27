import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { CardType } from '@oney/payment-messages';
import { PaymentIdentifier } from '../../PaymentIdentifier';
import { Card, CardProperties } from '../../domain/entities/Card';
import { IdGenerator } from '../../domain/gateways/IdGenerator';
import { BankAccountRepositoryRead } from '../../domain/repository/bankAccounts/BankAccountRepositoryRead';
import { CardRepositoryWrite } from '../../domain/repository/card/CardRepositoryWrite';

export class CreateCardRequest {
  accountId: string;

  cardType: CardType;

  cardId?: string;
}

@injectable()
export class CreateCard implements Usecase<CreateCardRequest, CardProperties> {
  constructor(
    @inject(PaymentIdentifier.cardRepositoryWrite) private readonly _cardRepositoryWrite: CardRepositoryWrite,
    @inject(PaymentIdentifier.idGenerator) private readonly _idGenerator: IdGenerator,
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
    @inject(EventProducerDispatcher) private readonly _eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: CreateCardRequest): Promise<CardProperties> {
    // Load the BankAccount aggregate, then create card.
    const { cardType, accountId, cardId } = request;
    const bankAccount = await this._bankAccountRepositoryRead.findById(request.accountId);
    const card = new Card({
      id: cardId || `card-${this._idGenerator.generateUniqueID()}`,
      ownerId: accountId,
      type: cardType,
      ref: null,
      pan: null,
      status: null,
      hasPin: false,
      preferences: null,
    });

    const createdCard = await this._cardRepositoryWrite.create(card);

    bankAccount.orderCard(createdCard.props);

    await this._eventDispatcher.dispatch(bankAccount);
    return createdCard.props;
  }
}
