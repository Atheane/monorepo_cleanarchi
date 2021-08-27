import { SplitPaymentScheduleProperties } from '../types/split/SplitPaymentScheduleProperties';

export interface SplitPaymentScheduleRepository {
  save(paymentSchedule: SplitPaymentScheduleProperties): Promise<SplitPaymentScheduleProperties>;
  getByContractNumber(contractNumber: string): Promise<SplitPaymentScheduleProperties>;
  getByUserId(userId: string): Promise<SplitPaymentScheduleProperties[]>;
}
