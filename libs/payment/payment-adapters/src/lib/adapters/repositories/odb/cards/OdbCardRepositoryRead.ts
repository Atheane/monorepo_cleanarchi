import { OneKey } from '@oney/common-core';
import {
  Card,
  CardError,
  CardRepositoryRead,
  LegacyBankAccount,
  QueryService,
  PaymentIdentifier,
} from '@oney/payment-core';
import { inject, injectable } from 'inversify';
import { SmoneyCardDetailMapper } from '../../../mappers/SmoneyCardDetailMapper';

@injectable()
export class OdbCardRepositoryRead implements CardRepositoryRead {
  private readonly smoneyCardDetailMapper: SmoneyCardDetailMapper;

  constructor(
    @inject(PaymentIdentifier.accountManagementQueryService) private readonly _queryService: QueryService,
  ) {
    this.smoneyCardDetailMapper = new SmoneyCardDetailMapper();
  }

  async findByAccountAndCardId(accountId: string, cardId: string): Promise<Card> {
    const legacyAccount = await this._queryService.findOne<LegacyBankAccount>({ uid: accountId });
    const legacyCardIndex = legacyAccount.cards.findIndex(item => item.cid === cardId);
    if (legacyCardIndex === -1) {
      throw new CardError.CardNotFound(cardId);
    }
    const legacyCard = legacyAccount.cards[legacyCardIndex];
    return this.smoneyCardDetailMapper.toDomain({ accountId, legacyCard });
  }

  async getAll(predicate?: OneKey<keyof Card>): Promise<Card[]> {
    const legacyAccountResult = await this._queryService.findOne<LegacyBankAccount>({
      uid: predicate.ownerId,
    });
    if (!legacyAccountResult) {
      throw new CardError.UserNotFound('USER_NOT_FOUND');
    }
    const legacyCards = legacyAccountResult.cards;

    return legacyCards.map(smoneyCard => {
      return this.smoneyCardDetailMapper.toDomain({ accountId: predicate.ownerId, legacyCard: smoneyCard });
    });
  }
}
