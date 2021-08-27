import {
  SagaMetadata,
  SagaRegistry,
  SagaRegistryEntry,
  SagaRegistryOptions,
  SagaState,
  SagaWorkflow,
  SagaWorkflowCtor,
} from '@oney/saga-core';

export class InMemorySagaRegistry extends SagaRegistry {
  private _registry: Map<string, SagaRegistryEntry>;

  constructor() {
    super();
    this._registry = new Map<string, SagaRegistryEntry>();
  }

  // todo check the generic pertinence
  public find<TState extends SagaState>(
    namespace: string,
    id: string,
    version: number,
  ): SagaRegistryEntry<TState> {
    const key = SagaMetadata.computeFullyQualifiedName(namespace, id, version);
    return this._registry.get(key) as SagaRegistryEntry<TState>;
  }

  public findByCtor<TSagaState extends SagaState>(
    saga: SagaWorkflowCtor<TSagaState>,
  ): SagaRegistryEntry<TSagaState> {
    const definition = SagaMetadata.getSagaDefinitionFromCtor(saga);
    return this.find(definition.namespace, definition.id, definition.version) as SagaRegistryEntry<
      TSagaState
    >;
  }

  public read(): SagaRegistryEntry[] {
    return Array.from(this._registry.values());
  }

  public register<TSagaState extends SagaState>(
    saga: SagaWorkflowCtor<TSagaState>,
    options?: SagaRegistryOptions,
  ) {
    const definition = SagaMetadata.getSagaDefinitionFromCtor(saga);

    if (!definition) {
      throw new Error(`The saga '${saga.name}' doesn't decorated with @Saga`);
    }

    const key = definition.fullyQualifiedName;

    this.assertRegistration(key);

    SagaWorkflow.configure(saga);

    this._registry.set(key, {
      definition: definition,
      options: options,
    });
  }

  private assertRegistration(key: string): void | never {
    if (this._registry.has(key)) {
      throw new Error(`Saga already registered: ${key}`);
    }
  }
}
