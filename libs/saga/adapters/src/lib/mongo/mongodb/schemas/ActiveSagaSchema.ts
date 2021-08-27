import { Event } from '@oney/messages-core';
import { ActiveSagaDataModel, ActiveSagaHistoryEntry, SagaState, SagaWorkflow } from '@oney/saga-core';
import { Connection, Document, Model, Schema } from 'mongoose';
import { SagaDefinitionSchema } from './SagaDefinitionSchema';

export type SagaInstanceDoc = SagaWorkflow<SagaState> & Document;

export const SagaInstanceSchema = new Schema<SagaInstanceDoc>({
  state: { type: Object }, // todo type
  completedAt: { type: Date },
});

export type ActiveSagaHistoryEntryDoc = ActiveSagaHistoryEntry<SagaState, Event> & Document;

export const ActiveSagaHistoryEntrySchema = new Schema<ActiveSagaHistoryEntryDoc>({
  executedAt: { type: Date },
  beforeState: { type: Object }, // todo type
  afterState: { type: Object }, // todo type
  event: { type: Object }, // todo type
});

export type ActiveSagaDoc = ActiveSagaDataModel<SagaState> & Document;

export const ActiveSagaSchema = new Schema<ActiveSagaDoc>({
  activeSagaId: { type: String, required: true, index: true, unique: true },
  definition: { type: SagaDefinitionSchema, required: true },
  instance: { type: SagaInstanceSchema, required: true },
  history: { type: [ActiveSagaHistoryEntrySchema], required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

let ActiveSagaModel;
export const connectActiveSagaModel = (connection: Connection): Model<ActiveSagaDoc> => {
  ActiveSagaModel = connection.model<ActiveSagaDoc>('ActiveSaga', ActiveSagaSchema);
  return ActiveSagaModel;
};

export const getActiveSagaModel = (): Model<ActiveSagaDoc> => ActiveSagaModel;
