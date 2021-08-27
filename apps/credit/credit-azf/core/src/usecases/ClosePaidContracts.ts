import { inject, injectable } from 'inversify';
import { Usecase } from './Usecase';
import { Identifiers } from '../../../adapters/src/di/Identifiers';
import { SplitPaymentSchedule } from '../domain';
import { SplitPaymentScheduleRepository } from '../domain/repositories';
import { ClosureContractService } from '../domain/services';

@injectable()
export class ClosePaidContracts implements Usecase<void, SplitPaymentSchedule[]> {
  constructor(
    @inject(Identifiers.closureContractsService)
    private readonly closureContractService: ClosureContractService,
    @inject(Identifiers.splitPaymentScheduleRepository)
    private readonly splitPaymentScheduleRepository: SplitPaymentScheduleRepository,
  ) {}

  async execute(): Promise<SplitPaymentSchedule[]> {
    const paymentSchedules = await this.splitPaymentScheduleRepository.getPaidSchedules();
    return this.closureContractService.closeManyContracts(paymentSchedules);
  }
}
