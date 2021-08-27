import { CardProperties, CardStatus, CardPreferences } from '@oney/payment-core';
import { CardType } from '@oney/payment-messages';

export interface CardDTO extends CardProperties {
  id: string;
  ownerId: string;
  ref: string;
  pan: string;
  hasPin: boolean;
  type: CardType;
  status: CardStatus;
  preferences: CardPreferences;
}
