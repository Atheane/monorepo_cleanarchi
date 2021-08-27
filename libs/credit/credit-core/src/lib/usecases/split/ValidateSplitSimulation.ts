import { inject, injectable } from 'inversify';
import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { CreditIdentifiers } from '../../CreditIdentifiers';
import { SplitSimulation } from '../../domain/entities';
import { SplitSimulationRepository } from '../../domain/repositories';
import { SplitSimulationProperties } from '../../domain/types';

export interface ValidateSplitSimulationCommand {
  simulationId: string;
}

@injectable()
export class ValidateSplitSimulation
  implements Usecase<ValidateSplitSimulationCommand, SplitSimulationProperties> {
  constructor(
    @inject(CreditIdentifiers.splitSimulationRepository)
    private readonly simulationRepository: SplitSimulationRepository,
    @inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: ValidateSplitSimulationCommand): Promise<SplitSimulationProperties> {
    const { simulationId } = request;

    const result = await this.simulationRepository.getById(simulationId);

    const simulation = SplitSimulation.validate({
      ...result,
    });

    await this.eventDispatcher.dispatch(simulation);

    return simulation.props;
  }
}
