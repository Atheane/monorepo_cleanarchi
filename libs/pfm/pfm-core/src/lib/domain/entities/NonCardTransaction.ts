import { Transaction } from './Transaction';
import { CounterParty, PublicProperties } from '../types';

export class NonCardTransaction extends Transaction {
  counterParty: CounterParty;

  constructor(transaction, counterParty: PublicProperties<CounterParty>) {
    super(transaction);
    Object.assign(this, transaction);

    if (counterParty && counterParty.iban) {
      this.counterParty = counterParty;
    }
  }
}
