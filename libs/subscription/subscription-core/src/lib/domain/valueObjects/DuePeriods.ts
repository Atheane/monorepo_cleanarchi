import * as moment from 'moment';
import { Periodicity } from '@oney/subscription-messages';

export class DuePeriods {
  calculate(activationDate: Date, paymentIndexes: number[], periodicity: Periodicity): number[] {
    const paymentDues = [];
    const lastPeriodDue = DuePeriods.computePeriodicity(activationDate, periodicity);
    const toFixedPeriod = Math.round(lastPeriodDue);
    const indexDictionary = new Map();
    for (let i = 1; i <= toFixedPeriod; i++) {
      indexDictionary.set(i, false);
    }
    if (paymentIndexes.length > 0) {
      for (const billing of paymentIndexes) {
        const isIndexExist = indexDictionary.get(billing);
        if (isIndexExist) {
          indexDictionary.set(billing, true);
        }
      }
    }
    for (const [key] of indexDictionary) {
      paymentDues.push(key);
    }
    // Loop over dictionnary and get number[]
    return paymentDues.filter(idx => !paymentIndexes.includes(idx));
  }

  private static computePeriodicity(activationDate: Date, periodicity: Periodicity): number {
    switch (periodicity) {
      case Periodicity.MONTHLY:
        return moment().diff(activationDate, 'months', true);
      case Periodicity.ANNUAL:
        return moment().diff(activationDate, 'years', true);
    }
  }
}
