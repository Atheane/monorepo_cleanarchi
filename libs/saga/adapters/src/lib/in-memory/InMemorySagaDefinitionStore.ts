import { SagaDefinition, SagaDefinitionStore, SagaState } from '@oney/saga-core';

export class InMemorySagaDefinitionStore extends SagaDefinitionStore {
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  public persist<TSagaState extends SagaState>(definition: SagaDefinition<TSagaState>) {}
}
