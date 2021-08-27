export class Amount {
  private amount: number;

  constructor(rawAmount: number) {
    this.amount = parseFloat(rawAmount.toFixed(2));
  }

  get value(): number {
    return this.amount;
  }
}
