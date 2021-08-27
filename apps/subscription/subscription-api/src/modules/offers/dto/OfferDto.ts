import { Mapper } from '@oney/common-core';
import { Offer } from '@oney/subscription-core';
import { OfferType } from '@oney/subscription-messages';

interface OfferDtoResponse {
  theme: {
    primary: string;
    secondary?: string;
  };
  banner: string;
  price: number;
}

export class OfferDto implements Mapper<Offer> {
  fromDomain(offer: Offer): OfferDtoResponse {
    if (offer.props.type === OfferType.ONEY_FIRST) {
      return {
        ...offer.props,
        price: offer.props.price.amount,
        banner:
          'https://firebasestorage.googleapis.com/v0/b/odb-f622c.appspot.com/o/offre-visuel-first-parent.png?alt=media&token=a059c6dd-91bf-4f94-aa13-80dde66572bd',
        theme: {
          primary: '#8D693B',
          secondary: '#A9894C',
        },
      };
    }
    return {
      ...offer.props,
      price: offer.props.price.amount,
      banner:
        'https://firebasestorage.googleapis.com/v0/b/odb-f622c.appspot.com/o/offre-visuel-original-parent.png?alt=media&token=edaa1b31-6976-4d4a-bb0d-c3785d7a5508',
      theme: {
        primary: '#84BD06',
      },
    };
  }
}
