import { KycDocument } from '../aggregates/KycDocument';
import { KycFilters } from '../types/KycFilters';

export interface KycGateway {
  createDocument(document: KycDocument): Promise<KycDocument>;
  setFilters(kycValues: KycFilters): Promise<void>;
}
