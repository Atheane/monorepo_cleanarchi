import { Mapper } from '@oney/common-core';
import { Card, CardPreferences, CardStatus, LegacyCard } from '@oney/payment-core';
import { CardType } from '@oney/payment-messages';
import { SmoneyCardStatusMapper } from './common/SmoneyCardStatusMapper';
import { SmoneyCardTypeMapper } from './common/SmoneyCardTypeMapper';

export type SmoneyCardDetailIntersection = {
  accountId: string;
  legacyCard: LegacyCard;
};

export class SmoneyCardDetailMapper implements Mapper<Card, SmoneyCardDetailIntersection> {
  constructor(
    private readonly cardStatusMapper: Mapper<CardStatus, number> = new SmoneyCardStatusMapper(),
    private readonly cardTypeMapper: Mapper<CardType, number> = new SmoneyCardTypeMapper(),
  ) {}

  toDomain(intersection: SmoneyCardDetailIntersection): Card {
    const { accountId, legacyCard } = intersection;

    const status = this.cardStatusMapper.toDomain(legacyCard.status);
    const type = this.cardTypeMapper.toDomain(legacyCard.cardType);

    return new Card({
      id: legacyCard.cid,
      ref: legacyCard.uniqueId,
      ownerId: accountId,
      pan: legacyCard.pan,
      hasPin: legacyCard.hasPin,
      status,
      type,
      preferences: new CardPreferences({
        blocked: legacyCard.blocked,
        foreignPayment: legacyCard.foreignPayment,
        internetPayment: legacyCard.internetPayment,
        atmWeeklyAllowance: legacyCard.atmWeeklyAllowance,
        atmWeeklyUsedAllowance: legacyCard.atmWeeklyUsedAllowance,
        monthlyAllowance: legacyCard.monthlyAllowance,
        monthlyUsedAllowance: legacyCard.monthlyUsedAllowance,
      }),
    });
  }
}
