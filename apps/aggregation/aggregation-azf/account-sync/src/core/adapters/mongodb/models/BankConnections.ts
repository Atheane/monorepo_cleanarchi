import * as mongoose from 'mongoose';
import { BankConnection } from '../../../domain/entities';

export type BankConnectionDoc = BankConnection & mongoose.Document;

export class BankConnectionSchema extends mongoose.Schema {
  constructor() {
    super(
      {
        userId: { type: String, required: true, index: true },
        refId: { type: String, required: true, unique: true },
        bankId: { type: String, required: true, index: true },
      },
      {
        versionKey: false,
      },
    );
  }
}

const BankConnectionIdentifier = 'BankConnections';

export const getBankConnectionModel = (connection: mongoose.Connection): mongoose.Model<BankConnectionDoc> =>
  connection.model<BankConnectionDoc>(BankConnectionIdentifier, new BankConnectionSchema());
