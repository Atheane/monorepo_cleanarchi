import { Transaction } from './Transaction';
import { Card, PublicProperties } from '../types';

export class CardTransaction extends Transaction {
  card: Card;

  constructor(transaction, card: PublicProperties<Card>) {
    super(transaction);
    Object.assign(this, transaction);
    this.card = card;
  }
}
