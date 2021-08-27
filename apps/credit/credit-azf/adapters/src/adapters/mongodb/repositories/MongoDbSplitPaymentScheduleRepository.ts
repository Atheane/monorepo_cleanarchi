import { injectable } from 'inversify';
import { SplitPaymentScheduleRepository, SplitPaymentSchedule } from '../../../../../core/src/domain';
import { ContractStatus, PaymentStatus } from '../../../../../core/src/domain/types';
import { SplitPaymentScheduleMapper } from '../../mappers/SplitPaymentScheduleMapper';
import { SplitPaymentScheduleModel } from '../models/SplitPaymentScheduleModel';

@injectable()
export class MongoDbSplitPaymentScheduleRepository implements SplitPaymentScheduleRepository {
  private paymentScheduleModel = SplitPaymentScheduleModel;

  constructor(private paymentScheduleMapper: SplitPaymentScheduleMapper) {}

  async save(paymentSchedule: SplitPaymentSchedule): Promise<SplitPaymentSchedule> {
    const result = await this.paymentScheduleModel
      .findOneAndUpdate(
        {
          id: paymentSchedule.id,
        },
        { ...paymentSchedule.props, updatedAt: new Date() },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      )
      .select('-_id')
      .lean();
    return this.paymentScheduleMapper.toDomain(result);
  }

  private async getUpcomingSchedules(): Promise<SplitPaymentSchedule[]> {
    const result = await this.paymentScheduleModel.aggregate([
      {
        $match: {
          $and: [
            { status: ContractStatus.IN_PROGRESS },
            {
              $or: [
                { 'fundingExecution.status': PaymentStatus.TODO },
                {
                  $and: [
                    { 'paymentsExecution.status': PaymentStatus.TODO },
                    { 'paymentsExecution.dueDate': { $lte: new Date() } },
                  ],
                },
              ],
            },
          ],
        },
      },
    ]);
    // const result = await this.paymentScheduleModel.find({ });

    return result.map(schedule => this.paymentScheduleMapper.toDomain(schedule));
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

  async getPaidSchedules(): Promise<SplitPaymentSchedule[]> {
    const result = await this.paymentScheduleModel.aggregate([
      {
        $match: {
          $and: [
            { status: ContractStatus.IN_PROGRESS },
            {
              $and: [
                {
                  fundingExecution: { $not: { $eq: { status: PaymentStatus.TODO } } },
                },
                {
                  paymentsExecution: { $not: { $elemMatch: { status: PaymentStatus.TODO } } },
                },
              ],
            },
          ],
        },
      },
    ]);
    return result.map(schedule => this.paymentScheduleMapper.toDomain(schedule));
  }

  async delete(paymentScheduleId: string): Promise<boolean> {
    const result = await this.paymentScheduleModel.findOneAndDelete({
      id: paymentScheduleId,
    });
    if (result) {
      return true;
    }
    return !!result;
  }
}
