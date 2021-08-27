import { SplitPaymentSchedule } from '../entities';

export interface ClosureContractService {
  closeManyContracts(splitPaymentSchedules: SplitPaymentSchedule[]): Promise<SplitPaymentSchedule[]>;
}
