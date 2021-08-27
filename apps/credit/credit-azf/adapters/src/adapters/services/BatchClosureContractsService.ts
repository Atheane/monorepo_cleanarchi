import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import {
  SplitPaymentSchedule,
  SplitContractRepository,
  SplitPaymentScheduleRepository,
  ClosureContractService,
  SplitContract,
} from '../../../../core/src/domain';
import { PromiseWithSettled, PromiseStatus } from '../../../../core/src/utils/PromiseWithSettled';
import { Identifiers } from '../../di/Identifiers';

@injectable()
export class BatchClosureContractsService implements ClosureContractService {
  constructor(
    @inject(Identifiers.splitContractRepository)
    private readonly splitContractRepository: SplitContractRepository,
    @inject(Identifiers.splitPaymentScheduleRepository)
    private readonly splitPaymentScheduleRepository: SplitPaymentScheduleRepository,
    @inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher,
  ) {}

  async closeManyContracts(splitPaymentSchedules: SplitPaymentSchedule[]): Promise<SplitPaymentSchedule[]> {
    const results = await PromiseWithSettled.allSettled(
      splitPaymentSchedules.map(async schedule => {
        try {
          const contract = await this.splitContractRepository.getByContractNumber(
            schedule.props.contractNumber,
          );
          contract.createFinalPaymentSchedule(schedule);
          contract.close();
          await this.splitContractRepository.save(contract);
          await this.splitPaymentScheduleRepository.delete(schedule.id);
          await this.dispatchEventsForSplitContract(contract);
          return Promise.resolve();
        } catch (e) {
          console.log(
            `Error - update contract number: ${schedule.props.contractNumber}. Detailed error: ${e}`,
          );
          return Promise.reject(schedule);
        }
      }),
    );
    return results.reduce((acc, next) => {
      if (next.status === PromiseStatus.REJECTED) {
        acc.push(next.reason);
      }
      return acc;
    }, []);
  }

  private async dispatchEventsForSplitContract(closedContract: SplitContract): Promise<void> {
    console.log(`dispatch event after close contract number: ${closedContract.props.contractNumber}`);
    await this.eventDispatcher.dispatch(closedContract);
  }
}
