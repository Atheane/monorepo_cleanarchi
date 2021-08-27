import { Merchant } from './Merchant';

export type Card = {
  cardId?: string;
  pan: string;
  merchant?: Merchant;
};
