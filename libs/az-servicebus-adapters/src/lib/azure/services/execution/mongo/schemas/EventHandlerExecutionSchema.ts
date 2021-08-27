import {
  EventHandlerExecutionDataModel,
  EventHandlerExecutionHistoryEntryDataModel,
} from '@oney/messages-core';
import { Connection, Document, Model, Schema } from 'mongoose';

export type EventHandlerExecutionHistoryEntryDoc = EventHandlerExecutionHistoryEntryDataModel & Document;

// todo type
export const EventHandlerExecutionHistoryEntrySchema = new Schema<EventHandlerExecutionHistoryEntryDoc>({
  executionId: { type: String, required: true },
  message: { type: Object, required: true },
  subscription: { type: Object, required: true },
  execution: { type: Object, required: true },
});

export type EventHandlerExecutionDoc = EventHandlerExecutionDataModel & Document;

export const EventHandlerExecutionSchema = new Schema<EventHandlerExecutionDoc>({
  messageId: { type: String, required: true },
  handlerUniqueIdentifier: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  completedAt: { type: Date },
  history: { type: [EventHandlerExecutionHistoryEntrySchema], required: true },
});

let eventHandlerExecutionModel;
export const connectEventHandlerExecutionModel = (
  connection: Connection,
): Model<EventHandlerExecutionDoc> => {
  eventHandlerExecutionModel = connection.model<EventHandlerExecutionDoc>(
    'EventHandlerExecution',
    EventHandlerExecutionSchema,
  );
  return eventHandlerExecutionModel;
};

export const getEventHandlerExecutionModel = (): Model<EventHandlerExecutionDoc> =>
  eventHandlerExecutionModel;
