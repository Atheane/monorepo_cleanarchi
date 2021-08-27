import { Mapper } from '@oney/common-core';
import { CardType } from '@oney/payment-messages';

export class SmoneyCardTypeMapper implements Mapper<CardType, number> {
  toDomain(type: number): CardType {
    switch (type) {
      case 2:
        return CardType.PHYSICAL_CLASSIC;
      case 4:
        return CardType.PHYSICAL_PREMIER;
    }

    return null;
  }

  fromDomain(type: CardType): number {
    switch (type) {
      case CardType.PHYSICAL_CLASSIC:
        return 2;
      case CardType.PHYSICAL_PREMIER:
        return 4;
    }

    return null;
  }
}
