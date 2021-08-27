import { DebtCollection } from './DebtCollection';
import { BankAccount } from '../aggregates/BankAccount';

export interface DebtCollectionTransferOrder {
  debtCollection: DebtCollection;
  senderToCollect: BankAccount;
  beneficiaryId: string;
  tagReference: number;
}
