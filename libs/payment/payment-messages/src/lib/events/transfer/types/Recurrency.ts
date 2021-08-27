import { TransferFrequencyType } from './TransferFrequencyType';

export interface Recurrency {
  endRecurrency: Date;

  frequencyType: TransferFrequencyType;

  recurrentDays: number;
}
