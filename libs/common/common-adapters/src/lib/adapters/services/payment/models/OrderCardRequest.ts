import { CardType } from '@oney/payment-messages';

export interface OrderCardRequest {
  uid: string;
  cardType: CardType;
}
