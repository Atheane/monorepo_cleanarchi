import { SagaActivator, SagaRegistry, SagaState, SagaWorkflow, SagaWorkflowCtor } from '@oney/saga-core';
import { Container } from 'inversify';
import { v4 } from 'uuid';

export class InMemorySagaActivator extends SagaActivator {
  private _registry: SagaRegistry;
  private _container: Container;

  constructor(container: Container, registry: SagaRegistry) {
    super();
    this._container = container;
    this._registry = registry;
  }

  public activate<TSagaState extends SagaState>(
    saga: SagaWorkflowCtor<TSagaState>,
  ): SagaWorkflow<TSagaState> {
    const instance = this._container.resolve(saga);

    // todo find solution for a beautiful state init
    instance.state = {
      instanceId: v4(),
      // originalEventId: undefined,
      // originator: undefined,
    } as TSagaState;

    return instance;
  }
}
