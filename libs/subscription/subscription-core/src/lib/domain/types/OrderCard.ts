import { CardType } from '@oney/payment-messages';

export interface OrderCard {
  uid: string;
  cardType: CardType;
}
