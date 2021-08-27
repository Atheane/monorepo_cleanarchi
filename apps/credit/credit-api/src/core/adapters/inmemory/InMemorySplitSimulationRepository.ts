import { injectable } from 'inversify';
import {
  SplitSimulationRepository,
  SplitSimulationError,
  SplitSimulationProperties,
} from '@oney/credit-core';

@injectable()
export class InMemorySplitSimulationRepository implements SplitSimulationRepository {
  constructor(private store: Map<string, SplitSimulationProperties>) {}

  save(simulationProps: SplitSimulationProperties): Promise<SplitSimulationProperties> {
    this.store.set(simulationProps.initialTransactionId, simulationProps);

    return Promise.resolve(simulationProps);
  }

  getById(id: string): Promise<SplitSimulationProperties> {
    const result = [...this.store.values()].find(item => item.id === id);
    if (result) {
      return Promise.resolve(result);
    }
    return Promise.reject(new SplitSimulationError.NotFound());
  }
}
