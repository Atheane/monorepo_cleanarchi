import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { CardGateway, EncryptedCardHmac } from '@oney/payment-core';
import { Authorization, CanExecuteResult, Identity, ServiceName } from '@oney/identity-core';
import { PaymentIdentifier } from '../../PaymentIdentifier';
import { BankAccountRepositoryRead } from '../../domain/repository/bankAccounts/BankAccountRepositoryRead';

export class CardHmacRequest {
  uid: string;

  cardId: string;

  rsaPublicKey: string;

  hmacData: string;
}

@injectable()
export class CardHmac implements Usecase<CardHmacRequest, EncryptedCardHmac> {
  constructor(
    @inject(PaymentIdentifier.cardGateway) private readonly _cardGateway: CardGateway,
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
  ) {}

  async execute(request: CardHmacRequest): Promise<EncryptedCardHmac> {
    const { uid, cardId, rsaPublicKey, hmacData } = request;

    const bankAccount = await this._bankAccountRepositoryRead.findById(uid);
    const card = bankAccount.getCardById(cardId);

    return this._cardGateway.hmac(card.props.id, rsaPublicKey, hmacData);
  }

  async canExecute(identity: Identity): Promise<CanExecuteResult> {
    const roles = identity.roles.find(item => item.scope.name === ServiceName.payment);

    if (roles.permissions.write === Authorization.self) {
      return CanExecuteResult.can();
    }
    return CanExecuteResult.cannot();
  }
}
