import { CardError } from '../../../models/errors/PaymentErrors';

export class AtmWeeklyAllowanceLimit {
  private readonly _value: number;

  constructor(value: number) {
    if (value < 0) {
      throw new CardError.InvalidAtmWeeklyAllowance('INVALID_ATM_WEEKLY_ALLOWANCE');
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }
}
