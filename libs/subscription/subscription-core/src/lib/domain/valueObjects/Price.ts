import * as moment from 'moment';
import { ValueObject } from '@oney/ddd';
import { BillingErrors } from '../models/BillingErrors';

const PRORATA_ACCOUNTABLE_DAYS = 30;

export class Price extends ValueObject<number> {
  constructor(amount: number) {
    if (amount < 0) {
      throw new BillingErrors.AmountNegativeError('AMOUNT_CANT_BE_NEGATIVE');
    }
    super(amount);
  }

  static calculateProrata(price: number, endDate?: Date): Price {
    let prorata = price;
    if (endDate) {
      const numberOfDaysSinceEndDate = moment().diff(endDate, 'days', true);
      // We fix days in month at 30 days because accountability principles and homogenization.
      prorata = (price * numberOfDaysSinceEndDate) / PRORATA_ACCOUNTABLE_DAYS;
    }
    return new Price(prorata);
  }

  get amount() {
    return this.props;
  }
}
