import * as mongoose from 'mongoose';
import { CreditorProperties } from '@oney/credit-core';

export type CreditorDoc = CreditorProperties & mongoose.Document;

export class CreditorSchema extends mongoose.Schema {
  constructor() {
    super(
      {
        userId: { type: String, required: true, index: true, unique: true },
        isEligible: { type: Boolean, required: true, default: false },
      },
      {
        versionKey: false,
      },
    );
  }
}

const CreditorIdentifier = 'Creditors';

export const getCreditorModel = (connection: mongoose.Connection): mongoose.Model<CreditorDoc> =>
  connection.model<CreditorDoc>(CreditorIdentifier, new CreditorSchema());
