import { SagaDefinitionDataModel } from '@oney/saga-core';
import { Connection, Document, Model, Schema } from 'mongoose';

export type SagaDefinitionDoc = SagaDefinitionDataModel & Document;

export const SagaDefinitionSchema = new Schema<SagaDefinitionDoc>({
  saga: {
    class: { type: String }, // use for human readability, should not be exploited by code behavior
    namespace: { type: String },
    id: { type: String },
    version: { type: Number },
  },
  startedByDefinition: { type: Object }, // todo type
  handles: { type: [Object] },
});

let SagaDefinitionModel;
export const connectSagaDefinitionModel = (connection: Connection): Model<SagaDefinitionDoc> => {
  SagaDefinitionModel = connection.model<SagaDefinitionDoc>('SagaDefinition', SagaDefinitionSchema);
  return SagaDefinitionModel;
};

export const getSagaDefinitionModel = (): Model<SagaDefinitionDoc> => SagaDefinitionModel;
