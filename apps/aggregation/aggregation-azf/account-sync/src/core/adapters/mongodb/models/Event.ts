import { Document, Schema, Connection, Model } from 'mongoose';
import { Event } from '../../../domain/types';

export type EventDoc = Event & Document;

export class EventSchema extends Schema {
  constructor() {
    super(
      {
        date: {
          type: Date,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
        data: {
          type: Object,
          required: true,
        },
        version: {
          type: Number,
          required: true,
        },
      },
      {
        versionKey: false,
      },
    );
  }
}

const EventIdentifier = 'budgetinsight_event';

export const getEventModel = (connection: Connection): Model<EventDoc> =>
  connection.model<EventDoc>(EventIdentifier, new EventSchema());
