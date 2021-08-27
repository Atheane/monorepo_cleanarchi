import { SplitPaymentSchedule } from '../entities';

export interface SplitPaymentScheduleRepository {
  save(paymentSchedule: SplitPaymentSchedule): Promise<SplitPaymentSchedule>;
  getUpcomingSchedulesByUser(): Promise<SplitPaymentSchedule[][]>;
  getPaidSchedules(): Promise<SplitPaymentSchedule[]>;
  delete(paymentScheduleId: string): Promise<boolean>;
}
