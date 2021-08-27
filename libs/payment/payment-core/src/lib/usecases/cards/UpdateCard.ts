import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { PaymentIdentifier } from '../../PaymentIdentifier';
import { CardProperties } from '../../domain/entities/Card';
import { BankAccountRepositoryRead } from '../../domain/repository/bankAccounts/BankAccountRepositoryRead';
import { CardRepositoryRead } from '../../domain/repository/card/CardRepositoryRead';
import { CardRepositoryWrite } from '../../domain/repository/card/CardRepositoryWrite';
import { UpdatableCardPreferences } from '../../domain/types/UpdatableCardPreferences';

export class UpdateCardRequest {
  accountId: string;

  cardId: string;

  hasPin: boolean;

  preferences: UpdatableCardPreferences;
}

@injectable()
export class UpdateCard implements Usecase<UpdateCardRequest, CardProperties> {
  constructor(
    @inject(PaymentIdentifier.cardRepositoryRead) private readonly cardRepositoryRead: CardRepositoryRead,
    @inject(PaymentIdentifier.cardRepositoryWrite) private readonly cardRepositoryWrite: CardRepositoryWrite,
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
    @inject(EventProducerDispatcher) private readonly _eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: UpdateCardRequest): Promise<CardProperties> {
    const bankAccount = await this._bankAccountRepositoryRead.findById(request.accountId);
    const card = bankAccount.getCardById(request.cardId);
    card.updatePreferences(request.preferences);
    card.hasPin = request.hasPin;
    bankAccount.updateCard(card.props);

    await this.cardRepositoryWrite.update(card);

    // SMoney returns a badly updated data on update
    const newlyUpdatedCard = await this.cardRepositoryRead.findByAccountAndCardId(
      request.accountId,
      request.cardId,
    );
    await this._eventDispatcher.dispatch(bankAccount);
    return newlyUpdatedCard.props;
  }
}
