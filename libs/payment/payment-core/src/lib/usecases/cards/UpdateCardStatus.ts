import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { PaymentIdentifier } from '../../PaymentIdentifier';
import { Card } from '../../domain/entities/Card';
import { BankAccountRepositoryRead } from '../../domain/repository/bankAccounts/BankAccountRepositoryRead';
import { CardRepositoryRead } from '../../domain/repository/card/CardRepositoryRead';
import { CardRepositoryWrite } from '../../domain/repository/card/CardRepositoryWrite';
import { CardStatus } from '../../domain/types/CardStatus';

export class UpdateCardStatusRequest {
  cardId: string;

  status: CardStatus;

  accountId: string;
}

@injectable()
export class UpdateCardStatus implements Usecase<UpdateCardStatusRequest, Card> {
  constructor(
    @inject(PaymentIdentifier.cardRepositoryRead) private readonly cardRepositoryRead: CardRepositoryRead,
    @inject(PaymentIdentifier.cardRepositoryWrite) private readonly cardRepositoryWrite: CardRepositoryWrite,
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
    @inject(EventProducerDispatcher) private readonly _eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: UpdateCardStatusRequest): Promise<Card> {
    const bankAccount = await this._bankAccountRepositoryRead.findById(request.accountId);
    const card = bankAccount.getCardById(request.cardId);

    bankAccount.updateCard({
      ...card.props,
      status: request.status,
    });
    await this.cardRepositoryWrite.update(card);

    // SMoney returns a badly updated data on update
    const cardFound = await this.cardRepositoryRead.findByAccountAndCardId(request.accountId, request.cardId);

    await this._eventDispatcher.dispatch(bankAccount);
    return cardFound;
  }
}
