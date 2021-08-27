import * as moment from 'moment';
import { PaymentError } from '../../models/errors/PaymentErrors';
import { TransferFrequencyType } from '../types/TransferFrequencyType';

export class Recurrency {
  endRecurrency: Date;

  frequencyType: TransferFrequencyType;

  recurrentDays: number;

  constructor(recurrency: Pick<Recurrency, 'endRecurrency' | 'frequencyType'>) {
    if (!this.isValidRecurentEndDate(recurrency.endRecurrency)) {
      throw new PaymentError.PaymentReccurentNotValid('END_RECURRENCY COULD NOT BE TODAY');
    }
    Object.assign(this, {
      ...recurrency,
      recurrentDays: this.handleRecurrentDay(recurrency.frequencyType),
    });
  }

  isValidRecurentEndDate(endRecurrency: Date): boolean {
    return moment().format('YYYY-MM-DD') !== moment(endRecurrency).format('YYYY-MM-DD');
  }

  handleRecurrentDay(frequencyType: TransferFrequencyType): number {
    switch (frequencyType) {
      case TransferFrequencyType.WEEKLY:
        return 7;
      case TransferFrequencyType.MONTHLY:
        return 1;
      default:
        throw new PaymentError.PaymentReccurentNotValid('FREQUENCY_TYPE_NOT_VALID');
    }
  }
}
