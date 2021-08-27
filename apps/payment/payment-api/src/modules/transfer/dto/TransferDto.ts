import { TransferProperties } from '@oney/payment-core';
import { CounterPartyDto } from './CounterPartyDto';
import { TagDto } from './TagDto';
import { RecurrencyDto } from './RecurrencyDto';

export interface TransferDto
  extends Omit<TransferProperties, 'beneficiary' | 'sender' | 'tag' | 'recurrence'> {
  id: string;
  beneficiary: CounterPartyDto;
  sender: CounterPartyDto;
  amount: number;
  message: string;
  orderId: string;
  executionDate: Date;
  tag: TagDto;
  recurrence?: RecurrencyDto;
}
