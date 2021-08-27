import { Tag } from './Tag';
import { CounterParty } from '../../types/CounterParty';

export interface P2pProperties {
  id?: string;
  beneficiary: CounterParty;
  sender: CounterParty;
  amount: number;
  message: string;
  orderId: string;
  date: Date;
  tag?: Tag;
  recurrence?: {
    endRecurrency: Date;
    frequencyType: number;
    recurrentDays?: number;
  };
}
