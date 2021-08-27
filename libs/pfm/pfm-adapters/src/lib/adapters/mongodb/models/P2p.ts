import { Document, Schema, Connection, Model } from 'mongoose';
import { P2pProperties } from '@oney/pfm-core';

export type P2pDoc = P2pProperties & Document;

export class P2pSchema extends Schema {
  constructor() {
    super(
      {
        id: {
          type: String,
          required: true,
          unique: true,
        },
        beneficiary: {
          id: { type: String, required: false },
          uid: { type: String, required: false },
          iban: { type: String, required: false },
          fullname: { type: String, required: false },
        },
        sender: {
          id: { type: String, required: false },
          uid: { type: String, required: false },
          iban: { type: String, required: false },
          fullname: { type: String, required: false },
        },
        date: { type: Date, required: true },
        amount: {
          type: Number,
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        orderId: {
          type: String,
          required: true,
        },
        tag: {
          generateUnpaid: {
            type: Boolean,
            required: true,
          },
          verifyLimits: {
            type: Boolean,
            required: true,
          },
          generatedTag: {
            type: String,
            required: true,
          },
        },
        recurrence: {
          endRecurrency: Date,
          frequencyType: Number,
          recurrentDays: Number,
        },
      },
      {
        versionKey: false,
      },
    );
  }
}

const P2pIdentifier = 'p2p';

let P2pModel;
export const connectP2pModel = (connection: Connection): Model<P2pDoc> => {
  P2pModel = connection.model<P2pDoc>(P2pIdentifier, new P2pSchema());
  return P2pModel;
};

export const getP2pModel = (): Model<P2pDoc> => P2pModel;
