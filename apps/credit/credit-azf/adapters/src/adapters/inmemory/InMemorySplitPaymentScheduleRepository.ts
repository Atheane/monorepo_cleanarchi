import { injectable } from 'inversify';
import { SplitPaymentScheduleRepository, SplitPaymentSchedule } from '../../../../core/src/domain';
import { ContractStatus, PaymentStatus, PaymentExecution } from '../../../../core/src/domain/types';

@injectable()
export class InMemorySplitPaymentScheduleRepository implements SplitPaymentScheduleRepository {
  constructor(private store: Map<string, SplitPaymentSchedule>) {}

  private filter(item: PaymentExecution): boolean {
    const passDue = Date.now() >= item.dueDate.getTime();
    return passDue && item.status === PaymentStatus.TODO;
  }

  save(paymentSchedule: SplitPaymentSchedule): Promise<SplitPaymentSchedule> {
    this.store.set(paymentSchedule.id, paymentSchedule);
    return Promise.resolve(paymentSchedule);
  }

  private getUpcomingSchedules(): Promise<SplitPaymentSchedule[]> {
    const paymentSchedules = [...this.store.values()].filter(
      item =>
        item.props.status === ContractStatus.IN_PROGRESS &&
        (item.props.fundingExecution.status === PaymentStatus.TODO ||
          item.props.paymentsExecution.filter(this.filter).length),
    );
    return Promise.resolve(paymentSchedules);
  }

  async getUpcomingSchedulesByUser(): Promise<SplitPaymentSchedule[][]> {
    const paymentSchedules = await this.getUpcomingSchedules();
    // there might be several on-going contracts and schedules by user
    // we need to gather them by users, because payments must be synchrone for each users (and can be parallelized between users)
    const paymentSchedulesByUser = {};
    paymentSchedules.forEach(schedule => {
      if (!paymentSchedulesByUser[schedule.props.userId]) {
        paymentSchedulesByUser[schedule.props.userId] = [schedule];
      } else {
        paymentSchedulesByUser[schedule.props.userId].push(schedule);
      }
    });
    return Promise.resolve(Object.values(paymentSchedulesByUser));
  }

  getPaidSchedules(): Promise<SplitPaymentSchedule[]> {
    const paymentSchedules = [...this.store.values()].filter(
      item =>
        item.props.status === ContractStatus.IN_PROGRESS &&
        item.props.fundingExecution.status === PaymentStatus.PAID &&
        item.props.paymentsExecution.filter(payment => payment.status === PaymentStatus.TODO).length === 0,
    );
    return Promise.resolve(paymentSchedules);
  }

  delete(paymentScheduleId: string): Promise<boolean> {
    return Promise.resolve(this.store.delete(paymentScheduleId));
  }
}
