import { Transfer } from '../../aggregates/Transfer';

export interface TransferRepositoryWrite {
  create(senderUid: string, transfer: Transfer, reason?: string): Promise<Transfer>;
}
