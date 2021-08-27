import { ContractStatus } from '@oney/credit-messages';
import { SplitContractProperties } from '../types';

export interface SplitContractRepository {
  save(contractProps: SplitContractProperties): Promise<SplitContractProperties>;
  getByInitialTransactionId(initialTransactionId: string): Promise<SplitContractProperties>;
  getByContractNumber(contractNumber: string): Promise<SplitContractProperties>;
  getByUserId(userId: string): Promise<SplitContractProperties[]>;
  getAll(status?: ContractStatus[]): Promise<SplitContractProperties[]>;
}
