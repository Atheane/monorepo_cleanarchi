import { Document, Schema, connection } from 'mongoose';
import { DbIdentifier } from './DbIdentifier';

export interface OdbEventStoreDocumentData {
  id: string;
  reference: string;
  date?: Date;
  type: string;
  actionCode: string;
  cardType: string;
  status: string;
  opposedReason: string;
  userId: string;
}

export interface OdbEventStoreDocument {
  date: Date;
  type: string;
  data: OdbEventStoreDocumentData;
}

export type CardLifecycleCallbackPayloadDoc = OdbEventStoreDocument & Document;

export class CardLifecycleCallbackPayloadSchema extends Schema {
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
          id: {
            type: String,
            required: true,
            index: true,
          },
          reference: {
            type: String,
            required: true,
            index: true,
          },
          type: {
            type: String,
            required: true,
          },
          cardType: {
            type: String,
            required: true,
          },
          actionCode: {
            type: String,
            required: true,
          },
          status: {
            type: String,
            required: true,
          },
          opposedReason: {
            type: String,
            required: true,
          },
          userId: {
            type: String,
            index: true,
          },
        },
      },
      {
        versionKey: false,
      },
    );
  }
}

const CardLifecycleCallbackPayloadIdentifier = 'smo_events';
const odbEventStore = connection.useDb(DbIdentifier.ODB_EVENT_STORE);

export const CardLifecycleCallbackPayloadModel = odbEventStore.model<CardLifecycleCallbackPayloadDoc>(
  CardLifecycleCallbackPayloadIdentifier,
  new CardLifecycleCallbackPayloadSchema(),
);
