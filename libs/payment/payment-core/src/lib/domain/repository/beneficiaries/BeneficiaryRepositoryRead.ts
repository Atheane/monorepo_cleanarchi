import { Beneficiary } from '../../entities/Beneficiary';

export interface BeneficiaryRepositoryRead {
  getById(bankAccountId: string, id: string): Promise<Beneficiary>;
}
