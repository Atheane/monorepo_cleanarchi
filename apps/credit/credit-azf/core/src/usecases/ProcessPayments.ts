import { EventDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { Usecase } from './Usecase';
import { Identifiers } from '../../../adapters/src/di/Identifiers';
import { PaymentGateway, SplitPaymentSchedule } from '../domain';
import { SplitPaymentScheduleRepository } from '../domain/repositories';

@injectable()
export class ProcessPayments implements Usecase<void, SplitPaymentSchedule[][]> {
  constructor(
    @inject(Identifiers.splitPaymentScheduleRepository)
    private readonly paymentScheduleRepository: SplitPaymentScheduleRepository,
    @inject(Identifiers.paymentGateway) private readonly paymentGateway: PaymentGateway,
    @inject(EventDispatcher) private readonly eventDispatcher: EventDispatcher,
  ) {}

  async execute(): Promise<SplitPaymentSchedule[][]> {
    const schedulesGroupByUser = await this.paymentScheduleRepository.getUpcomingSchedulesByUser();
    const scheduleProcessPromisesGroupByUser = schedulesGroupByUser.map(userSchedules =>
      this.paymentGateway.processPaymentSchedulesByUser(userSchedules),
    );
    const schedulesAfterProcessGroupByUSer = await Promise.all(scheduleProcessPromisesGroupByUser);
    return schedulesAfterProcessGroupByUSer;
  }
}
