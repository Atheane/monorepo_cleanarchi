import { BankConnectionProperties } from '@oney/aggregation-core';
import { Document, Schema, model } from 'mongoose';

export type BankConnectionDoc = BankConnectionProperties & Document;

export class BankConnectionSchema extends Schema {
  constructor() {
    super(
      {
        connectionId: {
          type: String,
          required: true,
          index: true,
          unique: true,
        },
        refId: {
          type: String,
          required: true,
          index: true,
          unique: true,
        },
        userId: { type: String, required: true, index: true },
        active: {
          type: Boolean,
          required: true,
          default: false,
          index: true,
        },
        form: { type: Object, required: false, default: null },
        state: { type: String, required: false, default: null },
        bankId: { type: String, required: true, index: true },
        connectionDate: { type: Date, required: true },
        createdAt: { type: Date, required: false, default: Date.now },
        updatedAt: { type: Date, required: false, default: Date.now },
      },
      {
        versionKey: false,
      },
    );
  }
}

const BankConnectionIdentifier = 'BankConnections';

export const BankConnectionModel = model<BankConnectionDoc>(
  BankConnectionIdentifier,
  new BankConnectionSchema(),
);
