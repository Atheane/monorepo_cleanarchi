import { Document, Schema, Connection, Model } from 'mongoose';
import { EventBudgetInsight } from '../../models/transaction/BudgetInsight';

export enum EventType {
  ACCOUNT_SYNC = 'ACCOUNT_SYNC',
}

export type EventDoc = EventBudgetInsight & Document;

export class EventSchema extends Schema {
  constructor() {
    super(
      {
        date: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
          index: true,
        },
        data: {
          type: Object,
          required: true,
        },
        version: {
          type: Number,
          required: true,
          index: true,
        },
      },
      {
        versionKey: false,
      },
    );
  }
}

const EventIdentifier = 'budgetinsight_event';

let EventModel;
export const connectEventModel = (connection: Connection): Model<EventDoc> => {
  EventModel = connection.model<EventDoc>(EventIdentifier, new EventSchema());
  return EventModel;
};

export const getEventModel = (): Model<EventDoc> => EventModel;
