import { injectable, inject } from 'inversify';
import { SplitProduct } from '@oney/credit-messages';
import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { SplitSimulation, SplitCalculator, SplitSimulationError, IdGenerator } from '../../domain';
import { SplitSimulationRepository } from '../../domain/repositories';
import { SplitSimulationProperties } from '../../domain/types';
import { CreditIdentifiers } from '../../CreditIdentifiers';
import { IAppConfiguration } from '../../domain/models/IAppConfiguration';

export interface SimulateSplitCommand {
  userId: string;
  productsCode: SplitProduct[];
  amount: number;
  initialTransactionId: string;
  transactionDate?: Date;
  label?: string;
}

@injectable()
export class SimulateSplit
  implements
    Usecase<
      SimulateSplitCommand,
      Pick<
        SplitSimulationProperties,
        'id' | 'fundingAmount' | 'fee' | 'apr' | 'immediatePayments' | 'deferredPayments'
      >[]
    > {
  constructor(
    @inject(CreditIdentifiers.configuration) private readonly configuration: IAppConfiguration,
    @inject(Symbol.for('splitSimulationRepository'))
    private readonly simulationRepository: SplitSimulationRepository,
    @inject(Symbol.for('longIdGenerator')) private readonly longIdGenerator: IdGenerator,
    @inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(
    request: SimulateSplitCommand,
  ): Promise<
    Pick<
      SplitSimulationProperties,
      'id' | 'fundingAmount' | 'fee' | 'apr' | 'immediatePayments' | 'deferredPayments'
    >[]
  > {
    const { userId, productsCode, amount, initialTransactionId, label, transactionDate } = request;

    const savedSimulations = productsCode.map(async productCode => {
      const result = new SplitCalculator(this.configuration).simulate(amount, productCode);
      if (!result) {
        throw new SplitSimulationError.UnkownSplitProduct();
      }

      const simulation = SplitSimulation.create({
        id: this.longIdGenerator.generateUniqueID(),
        initialTransactionId,
        userId,
        productCode,
        label,
        transactionDate: transactionDate ? new Date(transactionDate) : new Date(),
        ...result,
      });

      await this.eventDispatcher.dispatch(simulation);
      return this.simulationRepository.save(simulation.props);
    });

    return Promise.all(savedSimulations);
  }
}
