import { EventCtor } from '@oney/messages-core';
import { SagaDefinition } from './models/SagaDefinition';
import { SagaState } from './models/SagaState';
import { SagaWorkflowCtor } from './types/SagaWorkflowCtor';

export interface SagaRegistryOptions {
  eventTopicMap?: Map<EventCtor, string>;
}

export interface SagaRegistryEntry<TSagaState extends SagaState = SagaState> {
  definition: SagaDefinition<TSagaState>;
  options?: SagaRegistryOptions;
}

export abstract class SagaRegistry {
  abstract register<TSagaState extends SagaState>(
    saga: SagaWorkflowCtor<TSagaState>,
    options?: SagaRegistryOptions,
  ): void;

  abstract read(): SagaRegistryEntry[];

  abstract find<TSagaState extends SagaState>(
    namespace: string,
    id: string,
    version: number,
  ): SagaRegistryEntry<TSagaState>;

  abstract findByCtor<TSagaState extends SagaState>(
    saga: SagaWorkflowCtor<TSagaState>,
  ): SagaRegistryEntry<TSagaState>;
}
