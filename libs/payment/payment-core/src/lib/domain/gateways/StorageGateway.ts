import { KycDecisionDocument } from '@oney/profile-messages';
import { KycDocument } from '../aggregates/KycDocument';

export interface StorageGateway {
  getFiles(userId: string, documents: KycDecisionDocument[]): Promise<KycDocument>;
  getBankIdentityStatement(uid: string, bankAccountId: string): Promise<Buffer>;
}
