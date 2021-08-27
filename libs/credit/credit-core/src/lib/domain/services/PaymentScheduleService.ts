export interface PaymentScheduleService {
  getPaymentScheduleService(file: string): Promise<Buffer>;
}
