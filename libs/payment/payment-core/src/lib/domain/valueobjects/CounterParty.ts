export class CounterParty {
  id: string;

  uid?: string;

  iban?: string;

  fullName?: string;

  constructor(counterParty: CounterParty) {
    Object.assign(this, counterParty);
  }
}
