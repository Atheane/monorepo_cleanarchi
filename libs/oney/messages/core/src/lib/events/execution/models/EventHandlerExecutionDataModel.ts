import { EventHandlerExecutionHistoryEntryDataModel } from './EventHandlerExecutionHistoryEntryDataModel';

export interface EventHandlerExecutionDataModel {
  messageId: string;
  handlerUniqueIdentifier: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  history: EventHandlerExecutionHistoryEntryDataModel[];
}
