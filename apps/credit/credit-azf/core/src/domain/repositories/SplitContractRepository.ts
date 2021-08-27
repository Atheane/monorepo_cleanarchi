import { SplitContract } from '../entities';

export interface SplitContractRepository {
  save(contract: SplitContract): Promise<SplitContract>;
  getByContractNumber(contractNumber: string): Promise<SplitContract>;
}
