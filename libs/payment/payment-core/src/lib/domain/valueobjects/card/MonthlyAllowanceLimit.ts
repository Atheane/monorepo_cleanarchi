import { CardError } from '../../../models/errors/PaymentErrors';

export class MonthlyAllowanceLimit {
  private _value: number;

  constructor(value: number) {
    if (value < 0) {
      throw new CardError.InvalidMonthlyAllowance('INVALID_MONTHLY_ALLOWANCE');
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }
}
