import { SplitPaymentSchedule } from '../entities';

export interface PaymentGateway {
  processPaymentSchedule(paymentSchedule: SplitPaymentSchedule): Promise<SplitPaymentSchedule>;
  processPaymentSchedulesByUser(paymentSchedules: SplitPaymentSchedule[]): Promise<SplitPaymentSchedule[]>;
}
