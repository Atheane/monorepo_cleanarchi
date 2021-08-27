import { SagaDefinition } from '../models/SagaDefinition';
import { SagaState } from '../models/SagaState';

export abstract class SagaDefinitionStore {
  abstract persist<TSagaState extends SagaState>(definition: SagaDefinition<TSagaState>);
}
