import { Transfer } from '../../aggregates/Transfer';

export interface PaymentRepositoryWrite {
  create(senderUid: string, beneficiaryUid: string, payment: Transfer): Promise<Transfer>;
}
