import { Collection } from './Collection';
import { DebtStatus } from './DebtStatus';
import { CounterParty } from '../../transfer/types/CounterParty';
import { Recurrency } from '../../transfer/types/Recurrency';
import { Tag } from '../../transfer/types/Tag';

export interface DebtCollectedProps {
  debt: DebtProps;
  transfer: TransferProps;
}

export interface DebtProps {
  id: string;
  userId: string;
  date: Date;
  debtAmount: number;
  remainingDebtAmount: number;
  status: DebtStatus;
  reason: string;
  collections: Collection[];
}

export interface TransferProps {
  beneficiary: CounterParty;
  sender: CounterParty;
  amount: number;
  message: string;
  orderId: string;
  executionDate: Date;
  tag: Tag;
  recurrence?: Recurrency;
}
