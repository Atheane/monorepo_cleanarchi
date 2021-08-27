import { OfferType, SubscriptionStatus } from '@oney/subscription-messages';

export type OfferSubcriber = {
  offerId: string;
  subscriberId: string;
  status: SubscriptionStatus;
  offerType: OfferType;
};
