export class AmountPositive {
  private amount: number;

  constructor(rawAmount: number) {
    this.amount = parseFloat(Math.abs(rawAmount).toFixed(2));
  }

  get value(): number {
    return this.amount;
  }
}
