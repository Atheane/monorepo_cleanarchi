import { Event } from '@oney/messages-core';
import { EventCtor } from '@oney/messages-core';
import { SagaFromEventMapper } from './SagaFromEventMapper';
import { SagaWorkflow } from '../models/SagaWorkflow';
import { SagaWorkflowCtor } from '../types/SagaWorkflowCtor';
import { SagaState } from '../models/SagaState';
import { SagaDefinition } from '../models/SagaDefinition';
import { SagaMetadata } from '../metadata/SagaMetadata';

export class SagaPropertyMapper<TSagaState extends SagaState> {
  private _sagaDefinition: SagaDefinition<TSagaState>;

  constructor(owner: SagaWorkflow<TSagaState>) {
    this._sagaDefinition = SagaMetadata.ensureSagaDefinition(
      owner.constructor as SagaWorkflowCtor<TSagaState>,
    );
  }

  public configureMapping<TEvent extends Event>(
    event: EventCtor<TEvent>,
  ): SagaFromEventMapper<TSagaState, TEvent> {
    // todo check already defined
    const handleDefinition = this._sagaDefinition.findDefinitionByEvent<TEvent>(event);

    const thenBuilder = new SagaFromEventMapper<TSagaState, TEvent>(handleDefinition);

    return thenBuilder;
  }
}
