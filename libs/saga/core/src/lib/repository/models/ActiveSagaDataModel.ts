import { Uuid } from '@oney/core';
import { Event } from '@oney/messages-core';
import { ActiveSagaHistoryEntry } from '../../models/ActiveSagaHistoryEntry';
import { SagaDefinitionJsonModel } from '../../models/SagaDefinitionJsonModel';
import { SagaState } from '../../models/SagaState';
import { SagaWorkflow } from '../../models/SagaWorkflow';

export interface ActiveSagaDataModel<TSagaState extends SagaState> {
  activeSagaId: Uuid;

  definition: SagaDefinitionJsonModel;

  instance: SagaWorkflow<TSagaState>;

  history: ActiveSagaHistoryEntry<TSagaState, Event>[];

  createdAt: Date;

  updatedAt: Date;
}
