import { Mapper } from '@oney/common-core';
import { Card, CardPreferences, CardStatus } from '@oney/payment-core';
import { CardType } from '@oney/payment-messages';
import { SmoneyCardStatusMapper } from './common/SmoneyCardStatusMapper';
import { SmoneyCardTypeMapper } from './common/SmoneyCardTypeMapper';
import { SmoneyCreateCardRequest } from '../partners/smoney/models/card/createCard/SmoneyCreateCardRequest';
import { SmoneyCreateCardResponse } from '../partners/smoney/models/card/createCard/SmoneyCreateCardResponse';

export class SmoneyCardCreateMapper
  implements Mapper<Card, SmoneyCreateCardRequest | SmoneyCreateCardResponse> {
  constructor(
    private readonly cardStatusMapper: Mapper<CardStatus, number> = new SmoneyCardStatusMapper(),
    private readonly cardTypeMapper: Mapper<CardType, number> = new SmoneyCardTypeMapper(),
  ) {}

  toDomain(response: SmoneyCreateCardResponse): Card {
    // Should be put in a gateway who handle status card.
    const status = this.cardStatusMapper.toDomain(response.Status);
    const type = this.cardTypeMapper.toDomain(response.Type);

    return new Card({
      id: response.AppCardId,
      ref: response.UniqueId,
      ownerId: response.AccountId.AppAccountId,
      pan: response.Hint,
      type,
      status,
      hasPin: false,
      preferences: new CardPreferences({
        blocked: !!response.Blocked,
        foreignPayment: !response.ForeignPaymentBlocked,
        internetPayment: !response.InternetPaymentBlocked,
        atmWeeklyAllowance: response.CardLimits.ATMWeeklyAllowance,
        atmWeeklyUsedAllowance: response.CardLimits.ATMWeeklyUsedAllowance,
        monthlyAllowance: response.CardLimits.MonthlyAllowance,
        monthlyUsedAllowance: response.CardLimits.MonthlyUsedAllowance,
      }),
    });
  }

  fromDomain(card: Card): SmoneyCreateCardRequest {
    const type = this.cardTypeMapper.fromDomain(card.type);

    return {
      smoneyId: card.ownerId,
      AppCardId: card.id,
      Type: type,
      FintechCultureName: 'FRENCH',
      CreationType: { Action: 0 },
      UseRandomPin: 0,
    };
  }
}
