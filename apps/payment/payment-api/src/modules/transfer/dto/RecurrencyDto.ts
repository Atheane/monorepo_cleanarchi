import { TransferFrequencyType } from '@oney/payment-core';

export interface RecurrencyDto {
  endRecurrency: Date;
  frequencyType: TransferFrequencyType;
  recurrentDays: number;
}
