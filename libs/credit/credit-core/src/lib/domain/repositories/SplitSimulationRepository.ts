import { SplitSimulationProperties } from '../types';

export interface SplitSimulationRepository {
  save(simulationProps: SplitSimulationProperties): Promise<SplitSimulationProperties>;
  getById(id: string): Promise<SplitSimulationProperties>;
}
