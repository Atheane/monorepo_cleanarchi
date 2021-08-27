import { Periodicity } from '@oney/subscription-messages';
import * as moment from 'moment';

export class NextBillingDate {
  static calculate(periodicity: Periodicity, date: Date): Date {
    const billingDate = NextBillingDate.computeBillingDate(date, Periodicity.MONTHLY ? 'month' : 'year');
    switch (periodicity) {
      case Periodicity.MONTHLY:
        return moment(billingDate).add(1, 'month').toDate();
      case Periodicity.ANNUAL:
        return moment(billingDate).add(1, 'year').toDate();
      default:
        return null;
    }
  }

  private static computeBillingDate(date: Date, unitTimes: 'month' | 'year'): Date {
    const betweenActivationDateAndToday = moment(date).diff(moment(), unitTimes);
    return moment(date).add(betweenActivationDateAndToday, unitTimes).toDate();
  }
}
