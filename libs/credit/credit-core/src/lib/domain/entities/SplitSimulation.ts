import { SplitSimulated, SplitSimulationValidated } from '@oney/credit-messages';
import { AggregateRoot } from '@oney/ddd';
import { SplitSimulationProperties } from '../types/split/SplitSimulationProperties';

export class SplitSimulation extends AggregateRoot<SplitSimulationProperties> {
  id: string;

  readonly props: SplitSimulationProperties;

  constructor(simulationProps: SplitSimulationProperties) {
    super(simulationProps.id);
    this.props = simulationProps;
  }

  static create(props: SplitSimulationProperties): SplitSimulation {
    const simulation = new SplitSimulation(props);
    simulation.addDomainEvent(new SplitSimulated(props));
    return simulation;
  }

  static validate(props: SplitSimulationProperties): SplitSimulation {
    const simulation = new SplitSimulation(props);
    simulation.addDomainEvent(new SplitSimulationValidated(props));
    return simulation;
  }
}
