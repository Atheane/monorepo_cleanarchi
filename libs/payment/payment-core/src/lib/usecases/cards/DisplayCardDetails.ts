import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { CardGateway, EncryptedCardDetails } from '@oney/payment-core';
import { Authorization, CanExecuteResult, Identity, ServiceName } from '@oney/identity-core';
import { PaymentIdentifier } from '../../PaymentIdentifier';
import { BankAccountRepositoryRead } from '../../domain/repository/bankAccounts/BankAccountRepositoryRead';
import { ScaActions } from '../../models/ScaActions';

export class DisplayCardDetailsRequest {
  uid: string;

  cardId: string;

  rsaPublicKey: string;
}

@injectable()
export class DisplayCardDetails implements Usecase<DisplayCardDetailsRequest, EncryptedCardDetails> {
  constructor(
    @inject(PaymentIdentifier.cardGateway) private readonly _cardGateway: CardGateway,
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
  ) {}

  async execute(request: DisplayCardDetailsRequest): Promise<EncryptedCardDetails> {
    const { uid, cardId, rsaPublicKey } = request;

    const bankAccount = await this._bankAccountRepositoryRead.findById(uid);
    const card = bankAccount.getCardById(cardId);

    return this._cardGateway.displayDetails(card.props.id, rsaPublicKey);
  }

  async canExecute(identity: Identity, request?: DisplayCardDetailsRequest): Promise<CanExecuteResult> {
    const roles = identity.roles.find(item => item.scope.name === ServiceName.payment);

    if (roles.permissions.write === Authorization.self) {
      return CanExecuteResult.sca_needed({
        payload: request,
        actionType: ScaActions.DISPLAY_CARD_DETAILS,
      });
    }

    return CanExecuteResult.cannot();
  }
}
