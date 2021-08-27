import { Mapper } from '@oney/common-core';
import { OfferType } from '@oney/subscription-messages';
import { CardType } from '@oney/payment-messages';
import { injectable } from 'inversify';
import { OrderCardError } from '@oney/payment-core';

@injectable()
export class OfferTypeMapper implements Mapper<CardType> {
  toDomain(raw: OfferType): CardType {
    switch (raw) {
      case OfferType.VISA_PREMIER:
      case OfferType.ONEY_FIRST:
        return CardType.PHYSICAL_PREMIER;
      case OfferType.VISA_CLASSIC:
      case OfferType.ONEY_ORIGINAL:
        return CardType.PHYSICAL_CLASSIC;
      default:
        throw new OrderCardError.OfferCantBeProcessed('OFFER_TYPE_NOT_VALID');
    }
  }
}
